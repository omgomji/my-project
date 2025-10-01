const mongoose = require('mongoose');

// Product has nested variants. Keep schema simple (your current style: minimal validation, basic types).
// Each variant: color, size, stock.
const VariantSchema = new mongoose.Schema({
  color: { type: String, trim: true },
  size: { type: String, trim: true },
  stock: { type: Number, default: 0 }
}, { _id: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  category: { type: String, trim: true },
  variants: [VariantSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
