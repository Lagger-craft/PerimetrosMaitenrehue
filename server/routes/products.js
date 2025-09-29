const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado. Solo se permiten PNG, JPG, JPEG y WebP.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// @route   GET api/products
// @desc    Get all products
// @access  Admin only
router.get('/', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/products
// @desc    Create a new product
// @access  Admin only
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, stock, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Save path to image

    const newProduct = new Product({
      name,
      description,
      stock,
      price,
      image,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Admin only
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, stock, price } = req.body;
    let image = req.body.image; // Keep existing image if not new file

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, stock, price, image },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;