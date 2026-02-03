const express = require('express');
const Quote = require('../models/Quote');
const router = express.Router();

// Create a new quote
router.post('/', async (req, res) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();
    res.status(201).json(quote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all quotes
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find().populate('clientId');
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;