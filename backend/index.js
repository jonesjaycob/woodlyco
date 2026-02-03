const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const clientRoutes = require('./routes/clientRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB (use your own connection string)
mongoose.connect('mongodb://localhost:27017/woodlyco', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/quotes', quoteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});