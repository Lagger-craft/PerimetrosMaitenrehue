const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  // Información del cliente
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: { type: String, default: '' },
  
  // Ubicación
  country: { type: String, required: true, default: 'Chile' },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  postalCode: { type: String, default: '' },
  
  // Contacto
  phone: { type: String, required: true },
  email: { type: String, required: true },
  
  // Información adicional
  orderNotes: { type: String, default: '' },
  
  // Datos de la factura
  invoiceNumber: { type: String, unique: true, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'paid', 'cancelled'], 
    default: 'draft' 
  },
  
  // Fechas
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
  
  // Usuario que creó la factura
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Metadatos
  total: { type: Number, default: 0 },
  currency: { type: String, default: 'CLP' },
  
  // Items de la factura (opcional, para futuras extensiones)
  items: [{
    description: { type: String },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }],
  
  // Notas internas (solo visible para admins)
  internalNotes: { type: String, default: '' }
});

// Middleware para actualizar updatedAt antes de guardar
InvoiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Método estático para generar número de factura
InvoiceSchema.statics.generateInvoiceNumber = async function() {
  const currentYear = new Date().getFullYear();
  const yearPrefix = currentYear.toString();
  
  // Buscar la última factura del año actual
  const lastInvoice = await this.findOne({
    invoiceNumber: new RegExp(`^${yearPrefix}`)
  }).sort({ invoiceNumber: -1 });
  
  let nextNumber = 1;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.slice(-4));
    nextNumber = lastNumber + 1;
  }
  
  // Formatear con ceros a la izquierda (ej: 2024-0001)
  const formattedNumber = nextNumber.toString().padStart(4, '0');
  return `${yearPrefix}-${formattedNumber}`;
};

// Método para obtener el nombre completo del cliente
InvoiceSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Método para obtener la dirección completa
InvoiceSchema.virtual('fullAddress').get(function() {
  let address = this.streetAddress;
  if (this.city) address += `, ${this.city}`;
  if (this.region) address += `, ${this.region}`;
  if (this.postalCode) address += `, ${this.postalCode}`;
  return address;
});

// Asegurar que los virtuals se incluyan al convertir a JSON
InvoiceSchema.set('toJSON', { virtuals: true });
InvoiceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);