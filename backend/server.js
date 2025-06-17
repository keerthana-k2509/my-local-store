const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// In-memory data
const products = [
  { id: 1, name: 'Handmade Mug', description: 'Ceramic mug.', price: 12.99, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Cotton Scarf', description: 'Warm scarf.', price: 25.0, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Notebook', description: 'Recycled notebook.', price: 7.5, image: 'https://via.placeholder.com/150' }
];
const orders = [];
const reviews = [];

// GET /products with optional filters
app.get('/products', (req, res) => {
  let result = [...products];
  const { minPrice, maxPrice, name } = req.query;
  if (minPrice) result = result.filter(p => p.price >= +minPrice);
  if (maxPrice) result = result.filter(p => p.price <= +maxPrice);
  if (name) result = result.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(result);
});

// POST /orders
app.post('/orders', (req, res) => {
  const { items } = req.body;
  const id = Date.now().toString();
  const order = { id, items, status: 'Pending' };
  orders.push(order);
  res.json(order);
});

// GET /orders/:id
app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (order) res.json(order);
  else res.status(404).json({ error: 'Order not found' });
});

// Reviews
app.get('/products/:id/reviews', (req, res) => {
  const pid = +req.params.id;
  res.json(reviews.filter(r => r.productId === pid));
});
app.post('/products/:id/reviews', (req, res) => {
  const pid = +req.params.id;
  const { user, rating, comment } = req.body;
  const rev = { productId: pid, user, rating: +rating, comment };
  reviews.push(rev);
  res.json(rev);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
