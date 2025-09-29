const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rut: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  fenceHeight: { type: String, required: true },
  fenceType: { type: String, required: true },
  linearMeters: { type: String, required: true },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quote', QuoteSchema);
