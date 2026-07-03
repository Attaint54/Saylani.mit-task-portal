const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    event: {
      type: String,
      required: [true, 'Event is required'],
      trim: true,
    },
    availability: {
      type: [String],
      enum: ['Morning', 'Afternoon', 'Evening'],
      required: [true, 'Availability is required'],
    },
    status: {
      type: String,
      enum: ['Registered', 'Approved', 'Rejected'],
      default: 'Registered',
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
  },
  { timestamps: true }
);

volunteerSchema.index({ user: 1 });
volunteerSchema.index({ status: 1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);
