const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Invoice = require('../models/Invoice');

// @route   POST api/invoices
// @desc    Create a new invoice
// @access  Admin only
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      companyName,
      country,
      streetAddress,
      city,
      region,
      postalCode,
      phone,
      email,
      orderNotes,
      items,
      total,
      internalNotes
    } = req.body;

    // Validaciones básicas
    if (!firstName || !lastName || !streetAddress || !city || !region || !phone || !email) {
      return res.status(400).json({
        message: 'Los campos obligatorios no pueden estar vacíos'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'El formato del email no es válido'
      });
    }

    // Generar número de factura
    const invoiceNumber = await Invoice.generateInvoiceNumber();

    // Calcular total si se proporcionan items
    let calculatedTotal = total || 0;
    if (items && Array.isArray(items)) {
      calculatedTotal = items.reduce((sum, item) => {
        const itemTotal = (item.quantity || 1) * (item.unitPrice || 0);
        return sum + itemTotal;
      }, 0);
    }

    // Crear nueva factura
    const newInvoice = new Invoice({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      companyName: companyName?.trim() || '',
      country: country || 'Chile',
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      region: region.trim(),
      postalCode: postalCode?.trim() || '',
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      orderNotes: orderNotes?.trim() || '',
      invoiceNumber,
      total: calculatedTotal,
      items: items || [],
      createdBy: req.user.id,
      internalNotes: internalNotes?.trim() || '',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días desde hoy
    });

    // Actualizar totales de items si existen
    if (newInvoice.items.length > 0) {
      newInvoice.items = newInvoice.items.map(item => ({
        ...item,
        total: (item.quantity || 1) * (item.unitPrice || 0)
      }));
    }

    await newInvoice.save();

    // Populate el usuario que creó la factura
    await newInvoice.populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Factura creada exitosamente',
      invoice: newInvoice
    });

  } catch (err) {
    console.error('Error creating invoice:', err.message);
    
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Error interno: número de factura duplicado'
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET api/invoices
// @desc    Get all invoices with pagination
// @access  Admin only
router.get('/', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    // Construir filtros
    const filters = {};
    if (status && ['draft', 'pending', 'paid', 'cancelled'].includes(status)) {
      filters.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filters.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { companyName: searchRegex },
        { email: searchRegex },
        { invoiceNumber: searchRegex }
      ];
    }

    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      Invoice.find(filters)
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Invoice.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      invoices,
      pagination: {
        currentPage: page,
        totalPages,
        totalInvoices: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (err) {
    console.error('Error fetching invoices:', err.message);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET api/invoices/:id
// @desc    Get invoice by ID
// @access  Admin only
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!invoice) {
      return res.status(404).json({
        message: 'Factura no encontrada'
      });
    }

    res.json(invoice);

  } catch (err) {
    console.error('Error fetching invoice:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Factura no encontrada'
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT api/invoices/:id
// @desc    Update invoice
// @access  Admin only
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      companyName,
      streetAddress,
      city,
      region,
      postalCode,
      phone,
      email,
      orderNotes,
      status,
      items,
      total,
      internalNotes
    } = req.body;

    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        message: 'Factura no encontrada'
      });
    }

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: 'El formato del email no es válido'
        });
      }
    }

    // Validar status si se proporciona
    if (status && !['draft', 'pending', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({
        message: 'Estado de factura inválido'
      });
    }

    // Actualizar campos
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName.trim();
    if (lastName) updateFields.lastName = lastName.trim();
    if (companyName !== undefined) updateFields.companyName = companyName.trim();
    if (streetAddress) updateFields.streetAddress = streetAddress.trim();
    if (city) updateFields.city = city.trim();
    if (region) updateFields.region = region.trim();
    if (postalCode !== undefined) updateFields.postalCode = postalCode.trim();
    if (phone) updateFields.phone = phone.trim();
    if (email) updateFields.email = email.toLowerCase().trim();
    if (orderNotes !== undefined) updateFields.orderNotes = orderNotes.trim();
    if (status) updateFields.status = status;
    if (internalNotes !== undefined) updateFields.internalNotes = internalNotes.trim();

    // Actualizar items y total si se proporcionan
    if (items !== undefined) {
      updateFields.items = items.map(item => ({
        ...item,
        total: (item.quantity || 1) * (item.unitPrice || 0)
      }));
      
      // Recalcular total
      updateFields.total = updateFields.items.reduce((sum, item) => sum + item.total, 0);
    } else if (total !== undefined) {
      updateFields.total = total;
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');

    res.json({
      message: 'Factura actualizada exitosamente',
      invoice: updatedInvoice
    });

  } catch (err) {
    console.error('Error updating invoice:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Factura no encontrada'
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE api/invoices/:id
// @desc    Delete invoice
// @access  Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        message: 'Factura no encontrada'
      });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Factura eliminada exitosamente'
    });

  } catch (err) {
    console.error('Error deleting invoice:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Factura no encontrada'
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET api/invoices/stats/summary
// @desc    Get invoice statistics
// @access  Admin only
router.get('/stats/summary', adminAuth, async (req, res) => {
  try {
    const [
      totalInvoices,
      draftInvoices,
      pendingInvoices,
      paidInvoices,
      cancelledInvoices,
      totalRevenue,
      thisMonthRevenue
    ] = await Promise.all([
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: 'draft' }),
      Invoice.countDocuments({ status: 'pending' }),
      Invoice.countDocuments({ status: 'paid' }),
      Invoice.countDocuments({ status: 'cancelled' }),
      Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Invoice.aggregate([
        {
          $match: {
            status: 'paid',
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    res.json({
      totalInvoices,
      invoicesByStatus: {
        draft: draftInvoices,
        pending: pendingInvoices,
        paid: paidInvoices,
        cancelled: cancelledInvoices
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        thisMonth: thisMonthRevenue[0]?.total || 0
      }
    });

  } catch (err) {
    console.error('Error fetching invoice stats:', err.message);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;