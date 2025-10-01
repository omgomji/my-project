// Controller functions for Product (simple style, matching your previous experiments)
const Product = require('../models/Product');

// helper to wrap async without repeating try/catch everywhere
async function safe(run, res) {
  try {
    return await run();
  } catch (e) {
    console.error('Controller error:', e.message);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.seedSample = async function(req, res) {
  return safe(async () => {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Already seeded', count });
    }
    const docs = await Product.insertMany([
      {
        name: 'Running Shoes',
        price: 120,
        category: 'Footwear',
        variants: [
          { color: 'Red', size: 'M', stock: 10 },
          { color: 'Blue', size: 'L', stock: 5 }
        ]
      },
      {
        name: 'Smartphone',
        price: 699,
        category: 'Electronics',
        variants: []
      },
      {
        name: 'Winter Jacket',
        price: 200,
        category: 'Apparel',
        variants: [
          { color: 'Black', size: 'S', stock: 8 },
          { color: 'Gray', size: 'M', stock: 12 }
        ]
      }
    ]);
    res.status(201).json({ message: 'Seeded', inserted: docs.length });
  }, res);
};

exports.getAll = async function(req, res) {
  return safe(async () => {
    const products = await Product.find();
    res.json(products);
  }, res);
};

exports.getById = async function(req, res) {
  return safe(async () => {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  }, res);
};

exports.create = async function(req, res) {
  return safe(async () => {
    const body = req.body || {};
    const doc = await Product.create({
      name: body.name,
      price: body.price,
      category: body.category,
      variants: body.variants || []
    });
    res.status(201).json(doc);
  }, res);
};

exports.update = async function(req, res) {
  return safe(async () => {
    const body = req.body || {};
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name: body.name, price: body.price, category: body.category, variants: body.variants },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  }, res);
};

exports.remove = async function(req, res) {
  return safe(async () => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted', id: deleted._id });
  }, res);
};

exports.byCategory = async function(req, res) {
  return safe(async () => {
    const cat = req.params.category;
    const list = await Product.find({ category: cat });
    res.json(list);
  }, res);
};

exports.byColor = async function(req, res) {
  return safe(async () => {
    const color = req.params.color;
    // match any variant with that color
    const list = await Product.find({ 'variants.color': color });
    res.json(list);
  }, res);
};

exports.addVariant = async function(req, res) {
  return safe(async () => {
    const body = req.body || {};
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    p.variants.push({ color: body.color, size: body.size, stock: body.stock || 0 });
    await p.save();
    res.status(201).json(p);
  }, res);
};

exports.updateVariantStock = async function(req, res) {
  return safe(async () => {
    const pid = req.params.id;
    const vid = req.params.variantId;
    const body = req.body || {};
    const p = await Product.findById(pid);
    if (!p) return res.status(404).json({ message: 'Not found' });
    const v = p.variants.id(vid);
    if (!v) return res.status(404).json({ message: 'Variant not found' });
    if (typeof body.stock === 'number') v.stock = body.stock;
    await p.save();
    res.json(p);
  }, res);
};
