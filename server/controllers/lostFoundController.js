const LostFound = require('../models/LostFound');
const Notification = require('../models/Notification');
const { cloudinary } = require('../config/cloudinary');

exports.createItem = async (req, res, next) => {
  try {
    const { title, description, type, contactInfo } = req.body;
    let imageData = {};

    if (req.file) {
      imageData = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const item = await LostFound.create({
      user: req.user._id,
      title,
      description,
      type,
      contactInfo,
      image: imageData,
    });

    const existingItems = await LostFound.find({
      _id: { $ne: item._id },
      status: 'Pending',
    });

    for (const existing of existingItems) {
      const titleMatch = existing.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(existing.title.toLowerCase());
      const descMatch = existing.description.toLowerCase().includes(description.toLowerCase()) ||
        description.toLowerCase().includes(existing.description.toLowerCase());

      if (titleMatch || descMatch) {
        const notificationMessage = existing.type === 'Lost'
          ? `A found item "${title}" might match your lost item "${existing.title}"`
          : `A lost item "${title}" might match your found item "${existing.title}"`;

        await Notification.create({
          user: existing.user,
          title: 'Potential Match Found',
          message: notificationMessage,
          type: 'lost_found',
          relatedId: item._id,
        });

        const io = req.app.get('io');
        if (io) {
          io.to(existing.user.toString()).emit('notification', {
            title: 'Potential Match Found',
            message: notificationMessage,
            type: 'lost_found',
          });
        }
      }
    }

    const populated = await LostFound.findById(item._id).populate('user', 'name email');
    res.status(201).json({ message: 'Item created', item: populated });
  } catch (error) {
    next(error);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { type, status, search } = req.query;

    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await LostFound.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LostFound.countDocuments(query);

    res.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await LostFound.findById(req.params.id).populate('user', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ item });
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { title, description, type, status, contactInfo } = req.body;
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (req.file) {
      if (item.image.publicId) {
        await cloudinary.uploader.destroy(item.image.publicId);
      }
      item.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    if (title) item.title = title;
    if (description) item.description = description;
    if (type) item.type = type;
    if (status) item.status = status;
    if (contactInfo) item.contactInfo = contactInfo;

    await item.save();

    const populated = await LostFound.findById(item._id).populate('user', 'name email');
    res.json({ message: 'Item updated', item: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateItemStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const item = await LostFound.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await Notification.create({
      user: item.user._id,
      title: 'Lost & Found Status Updated',
      message: `Your item "${item.title}" status is now "${status}"`,
      type: 'lost_found',
      relatedId: item._id,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(item.user._id.toString()).emit('notification', {
        title: 'Lost & Found Status Updated',
        message: `Your item "${item.title}" status is now "${status}"`,
        type: 'lost_found',
      });
    }

    res.json({ message: 'Status updated', item });
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.image.publicId) {
      await cloudinary.uploader.destroy(item.image.publicId);
    }

    await LostFound.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    next(error);
  }
};
