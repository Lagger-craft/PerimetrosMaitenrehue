const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Quote = require('../models/Quote');

// @route   POST api/quotes
// @desc    Create a new quote
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newQuote = new Quote(req.body);
    await newQuote.save();
    res.status(201).json({ message: 'Quote submitted successfully', quote: newQuote });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/quotes
// @desc    Get all quotes
// @access  Admin only
router.get('/', adminAuth, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ timestamp: -1 });
    res.json(quotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
