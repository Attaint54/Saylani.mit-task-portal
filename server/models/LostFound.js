const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['Lost', 'Found'],
      required: [true, 'Type is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Found'],
      default: 'Pending',
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    contactInfo: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

lostFoundSchema.index({ user: 1, createdAt: -1 });
lostFoundSchema.index({ type: 1, status: 1 });
lostFoundSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('LostFound', lostFoundSchema);
