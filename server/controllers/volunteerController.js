const Volunteer = require('../models/Volunteer');
const Notification = require('../models/Notification');

exports.registerVolunteer = async (req, res, next) => {
  try {
    const { name, event, availability, phone, email } = req.body;

    const existing = await Volunteer.findOne({ user: req.user._id, event });
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const volunteer = await Volunteer.create({
      user: req.user._id,
      name,
      event,
      availability,
      phone,
      email,
    });

    res.status(201).json({ message: 'Volunteer registration submitted', volunteer });
  } catch (error) {
    next(error);
  }
};

exports.getVolunteers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { event: { $regex: search, $options: 'i' } },
      ];
    }

    const volunteers = await Volunteer.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Volunteer.countDocuments(query);

    res.json({
      volunteers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateVolunteerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    await Notification.create({
      user: volunteer.user._id,
      title: 'Volunteer Status Updated',
      message: `Your volunteer registration for "${volunteer.event}" is ${status}`,
      type: 'volunteer',
      relatedId: volunteer._id,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(volunteer.user._id.toString()).emit('notification', {
        title: 'Volunteer Status Updated',
        message: `Your volunteer registration for "${volunteer.event}" is ${status}`,
        type: 'volunteer',
      });
    }

    res.json({ message: 'Status updated', volunteer });
  } catch (error) {
    next(error);
  }
};

exports.deleteVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json({ message: 'Volunteer deleted' });
  } catch (error) {
    next(error);
  }
};
