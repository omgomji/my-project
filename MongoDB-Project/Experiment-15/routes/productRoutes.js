const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');

// seed first (idempotent) for quick demo
router.post('/seed', ctrl.seedSample);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.get('/category/:category', ctrl.byCategory);
router.get('/by-color/:color', ctrl.byColor);

router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.post('/:id/variants', ctrl.addVariant);
router.put('/:id/variants/:variantId/stock', ctrl.updateVariantStock);

module.exports = router;
