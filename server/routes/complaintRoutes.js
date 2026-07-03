const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
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
    body('category').isIn(['Internet', 'Electricity', 'Water', 'Maintenance', 'Cleaning', 'Other'])
      .withMessage('Invalid category'),
  ],
  validate,
  createComplaint
);

router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaint);
router.put('/:id', protect, upload.single('image'), updateComplaint);
router.put('/:id/status', protect, admin, updateComplaintStatus);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;
