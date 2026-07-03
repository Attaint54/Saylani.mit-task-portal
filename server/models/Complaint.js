const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: ['Internet', 'Electricity', 'Water', 'Maintenance', 'Cleaning', 'Other'],
      required: [true, 'Category is required'],
    },
    status: {
      type: String,
      enum: ['Submitted', 'In Progress', 'Resolved'],
      default: 'Submitted',
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
