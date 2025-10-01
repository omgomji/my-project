const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/exp15_catalog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB exp15_catalog');
}).catch(err => {
  console.error('Mongo connect error:', err.message);
});

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

app.get('/', function(req, res) {
  res.send('<h2>Experiment 15 - E-commerce Catalog</h2><p>Use <code>/products</code> endpoints. Seed with POST /products/seed</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Server running on http://localhost:' + PORT);
});
