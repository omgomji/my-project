// Simple Express backend with CORS and a products endpoint
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory products (kept simple, matching your style)
const products = [
	{ id: 1, name: 'Wireless Mouse', price: 25.99 },
	{ id: 2, name: 'Mechanical Keyboard', price: 79.5 },
	{ id: 3, name: 'HD Monitor', price: 179.0 }
];

app.get('/', function (req, res) {
	res.send('<h2>Experiment 19 - Products API</h2><p>Use <code>/api/products</code></p>');
});

app.get('/api/products', function (req, res) {
	res.json(products);
});

app.listen(PORT, function () {
	console.log('Backend running on http://localhost:' + PORT);
});
