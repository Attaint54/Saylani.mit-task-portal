const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const { cloudinary } = require('../config/cloudinary');

exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    let imageData = {};

    if (req.file) {
      imageData = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      category,
      image: imageData,
    });

    const populated = await Complaint.findById(complaint._id).populate('user', 'name email');

    res.status(201).json({ message: 'Complaint submitted', complaint: populated });
  } catch (error) {
    next(error);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, category, search } = req.query;

    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ complaint });
  } catch (error) {
    next(error);
  }
};

exports.updateComplaint = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.file) {
      if (complaint.image.publicId) {
        await cloudinary.uploader.destroy(complaint.image.publicId);
      }
      complaint.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    complaint.category = category || complaint.category;

    await complaint.save();

    const populated = await Complaint.findById(complaint._id).populate('user', 'name email');
    res.json({ message: 'Complaint updated', complaint: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await Notification.create({
      user: complaint.user._id,
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.title}" is now "${status}"`,
      type: 'complaint',
      relatedId: complaint._id,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(complaint.user._id.toString()).emit('notification', {
        title: 'Complaint Status Updated',
        message: `Your complaint "${complaint.title}" is now "${status}"`,
        type: 'complaint',
      });
    }

    res.json({ message: 'Status updated', complaint });
  } catch (error) {
    next(error);
  }
};

exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.image.publicId) {
      await cloudinary.uploader.destroy(complaint.image.publicId);
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    next(error);
  }
};
