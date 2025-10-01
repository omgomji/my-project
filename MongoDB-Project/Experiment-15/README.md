# E-commerce Catalog with Nested Variants and MVC – Experiment 15

A beginner-friendly MongoDB + Express experiment that moves from in‑memory CRUD (Experiments 10–11) to a **persisted data model** using **nested documents** (product variants) and a simple MVC layout (`models / controllers / routes`).

This consolidates concepts you practiced separately:
- Basic REST routes (Experiments 10–11)
- Structured data modeling (arrays / objects)
- Incremental feature layering (filtering, list updates, status codes)

## Objective
Design and query a MongoDB collection where each product embeds an array of variant subdocuments (color, size, stock). Practice:
- Schema definition with nested subdocuments
- CRUD operations with Mongoose
- Simple filtered queries (by category, by variant color)
- Updating nested array items (variant stock)
- MVC separation for clearer code organization

## Why This Experiment
| Earlier Experiment | What You Practiced | This Experiment Adds |
|--------------------|--------------------|----------------------|
| 10 (CLI employees) | Array CRUD logic + input loop | Real database + HTTP API |
| 11 (Cards API) | REST with Express (in memory) | Persistent model (Mongoose) |
| 12 (Seat locking) | State transitions, simple concurrency ideas | Nested documents & targeted updates |
| 7–8 (React basics) | Data-driven rendering | Backend shape ready for a frontend consumer |

## Data Model
Each product has a `variants` array. Variant documents have their own `_id` so they can be referenced for stock updates.
```js
Product: {
  _id: ObjectId,
  name: String,
  price: Number,
  category: String,
  variants: [
    { _id: ObjectId, color: String, size: String, stock: Number }
  ],
  createdAt, updatedAt
}
```

### Example Seed Documents
Inserted by `POST /products/seed` (idempotent):
```json
[
  {
    "name": "Running Shoes",
    "price": 120,
    "category": "Footwear",
    "variants": [
      { "color": "Red",  "size": "M", "stock": 10 },
      { "color": "Blue", "size": "L", "stock": 5 }
    ]
  },
  {
    "name": "Smartphone",
    "price": 699,
    "category": "Electronics",
    "variants": []
  },
  {
    "name": "Winter Jacket",
    "price": 200,
    "category": "Apparel",
    "variants": [
      { "color": "Black", "size": "S", "stock": 8 },
      { "color": "Gray",  "size": "M", "stock": 12 }
    ]
  }
]
```

## Folder Layout (MVC)
```
Experiment-15/
├── controllers/
│   └── productController.js   # Business logic (CRUD + filters + variant ops)
├── models/
│   └── Product.js             # Mongoose schemas (Product + Variant)
├── routes/
│   └── productRoutes.js       # Express route definitions
├── server.js                  # App bootstrap + Mongo connection
├── package.json               # Dependencies + scripts
└── README.md                  # This document
```

## Key Files (Minimal Snippets)
`models/Product.js`
```js
const VariantSchema = new mongoose.Schema({
  color: String, size: String, stock: { type: Number, default: 0 }
});
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: String,
  variants: [VariantSchema]
}, { timestamps: true });
```

`controllers/productController.js` (pattern: small async + shared error wrapper)
```js
exports.addVariant = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  p.variants.push({ color: req.body.color, size: req.body.size, stock: req.body.stock || 0 });
  await p.save();
  res.status(201).json(p);
};
```

## Endpoints (Base URL: `http://localhost:3000`)
| Method | Path | Purpose |
|--------|------|---------|
| POST | /products/seed | Insert sample documents (only first time) |
| GET | /products | List all products |
| GET | /products/:id | Get single product by id |
| GET | /products/category/:category | Filter by category |
| GET | /products/by-color/:color | Products having at least one variant with that color |
| POST | /products | Create product (optionally with variants) |
| PUT | /products/:id | Replace product (and variants array) |
| DELETE | /products/:id | Remove product |
| POST | /products/:id/variants | Append a variant |
| PUT | /products/:id/variants/:variantId/stock | Update stock of one variant |

### Sample Create Request
```http
POST /products
Content-Type: application/json
{
  "name": "Gaming Laptop",
  "price": 1499,
  "category": "Electronics",
  "variants": [
    { "color": "Black", "size": "15-inch", "stock": 4 },
    { "color": "Silver", "size": "17-inch", "stock": 2 }
  ]
}
```

### Update Variant Stock
```http
PUT /products/<productId>/variants/<variantId>/stock
Content-Type: application/json
{ "stock": 12 }
```

## Typical Flow
```
POST /products/seed   -> seed docs (only once)
GET  /products         -> view all
GET  /products/by-color/Blue -> color filter
POST /products         -> add new product
POST /products/:id/variants  -> add a new variant
PUT  /products/:id/variants/:variantId/stock -> adjust stock
PUT  /products/:id     -> rename / change price / replace variants
DELETE /products/:id   -> cleanup
```

## How to Run
```bash
npm install
npm start    # or: node server.js
# Ensure local MongoDB service is running on default port
```
Then open: `http://localhost:3000/` (small help page).

## Learning Objectives
- Translate an in‑memory CRUD pattern to persistent storage
- Embed related, small documents (variants) directly inside a parent
- Query by fields nested inside arrays (`'variants.color': value`)
- Perform targeted update of a subdocument by `_id`
- Maintain a simple MVC separation (model vs controller vs route)

## What You Practiced (Mapped)
| Concept | Where Seen |
|---------|------------|
| Mongoose connection | `server.js` |
| Schema + nested array | `models/Product.js` |
| Controller abstraction | `controllers/productController.js` |
| REST endpoints | `routes/productRoutes.js` |
| Variant stock update logic | `updateVariantStock` controller |

## Notes / Constraints
- No advanced validation yet (trusting input)
- Entire variants array is replaced on full product `PUT`
- 500 errors share a generic message (simple style consistent with earlier experiments)
- Seed endpoint does nothing after first insert (count check)

## Possible Enhancements
- Add simple field validation (price > 0, non-empty name)
- Add pagination (`?page=1&limit=10`)
- Project only matching variants for `/by-color/:color`
- Implement partial updates with `PATCH` (e.g. just price)
- Add search by name substring (`?q=lap`)
- Introduce indexes on `{ category: 1 }` or `{ 'variants.color': 1 }`
- Add soft delete (`deleted: true`) instead of hard remove

## Incremental Next Steps
1. Validation layer (Zod or manual checks)
2. Dedicated error middleware instead of inline try/catch wrapper
3. Frontend (React) consuming `/products` API
4. Auth (protect write routes) + basic rate limiting
5. Dockerize (Mongo + API) for portable dev environment

## Key Takeaways
- Nested arrays are great for tightly coupled data (variants rarely used outside product context)
- Simpler reads: one query returns product + its variant states
- Updates require loading the document then modifying array items (acceptable for small variant lists)
- Clean folder separation keeps each concern small and readable

---