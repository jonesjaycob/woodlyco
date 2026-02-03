const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  dateIssued: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);