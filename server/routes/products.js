const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs for file system operations

// Function to check file magic numbers for robust type validation
const checkMagicNumber = (filePath) => {
  const buffer = fs.readFileSync(filePath, null, 8); // Read first 8 bytes

  // Common image magic numbers
  const magicNumbers = {
    'ffd8ffe0': 'image/jpeg',
    'ffd8ffe1': 'image/jpeg',
    'ffd8ffe2': 'image/jpeg',
    'ffd8ffe3': 'image/jpeg',
    '89504e470d0a1a0a': 'image/png',
    '52494646': 'image/webp', // RIFF header, needs further check for WEBP
  };

  const hex = buffer.toString('hex', 0, 8);

  for (const magic in magicNumbers) {
    if (hex.startsWith(magic)) {
      // For WebP, check for 'WEBP' at offset 8-12
      if (magicNumbers[magic] === 'image/webp') {
        const webpCheck = buffer.toString('ascii', 8, 12);
        if (webpCheck === 'WEBP') {
          return 'image/webp';
        }
      } else {
        return magicNumbers[magic];
      }
    }
  }
  return null; // Not a recognized image type
};

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Sanitize filename: remove non-alphanumeric characters, replace spaces with hyphens
    const sanitizedOriginalname = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    cb(null, Date.now() + '-' + sanitizedOriginalname); // Unique and sanitized filename
  },
});

// File filter to accept only images and perform magic number check
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  
  // Basic MIME type check (can be spoofed, but good first line of defense)
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Tipo de archivo no soportado. Solo se permiten PNG, JPG, JPEG y WebP.'), false);
  }

  // For more robust validation, we'll perform magic number check AFTER the file is written to disk
  // Multer's fileFilter runs BEFORE destination, so we'll do this check in the route handler
  cb(null, true); // Accept the file for now, will validate content later
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

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

// Helper function to handle file validation and product saving/updating
const handleProductUpload = async (req, res, next) => {
  if (req.file) {
    const detectedMimeType = checkMagicNumber(req.file.path);
    const allowedMagicTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!detectedMimeType || !allowedMagicTypes.includes(detectedMimeType)) {
      // If magic number check fails, delete the uploaded file and send error
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'El contenido del archivo no es una imagen válida o el tipo no está permitido.' });
    }
  }
  next(); // Continue to the actual route handler
};

// @route   POST api/products
// @desc    Create a new product
// @access  Admin only
router.post('/', adminAuth, upload.single('image'), handleProductUpload, async (req, res) => {
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
    // If an error occurs after file upload but before saving to DB, delete the file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Admin only
router.put('/:id', adminAuth, upload.single('image'), handleProductUpload, async (req, res) => {
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
      // If product not found, delete the uploaded file if any
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    // If an error occurs after file upload but before saving to DB, delete the file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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
    // Optionally, delete the associated image file from the server
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
