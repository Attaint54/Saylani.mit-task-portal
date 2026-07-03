const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  updateItemStatus,
  deleteItem,
} = require('../controllers/lostFoundController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');

router.post(
  '/',
  protect,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('type').isIn(['Lost', 'Found']).withMessage('Type must be Lost or Found'),
  ],
  validate,
  createItem
);

router.get('/', protect, getItems);
router.get('/:id', protect, getItem);
router.put('/:id', protect, upload.single('image'), updateItem);
router.put('/:id/status', protect, admin, updateItemStatus);
router.delete('/:id', protect, deleteItem);

module.exports = router;
