const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  stock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  image: { type: String }, // URL to the image
});

module.exports = mongoose.model('Product', ProductSchema);
