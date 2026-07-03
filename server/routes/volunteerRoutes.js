const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  registerVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
} = require('../controllers/volunteerController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('event').trim().notEmpty().withMessage('Event is required'),
    body('availability').isArray({ min: 1 }).withMessage('At least one availability slot required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  validate,
  registerVolunteer
);

router.get('/', protect, getVolunteers);
router.put('/:id/status', protect, admin, updateVolunteerStatus);
router.delete('/:id', protect, deleteVolunteer);

module.exports = router;
