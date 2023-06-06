const router = require('express').Router();

const Notification = require('../models/notificationModel');
const authMiddleWare = require('../middlewares/authmiddleware');

router.post('/add-notification', authMiddleWare, async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();

    res.send({
      success: true,
      data: newNotification,
      message: 'Notification added successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

router.get('/get-all-notifications', authMiddleWare, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({ createdAt: -1 });

    res.send({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.sendStatus({
      success: false,
      error: error.message,
    });
  }
});

router.post('/mark-as-read', authMiddleWare, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.body.userId,
        read: false,
      },
      {
        read: true,
      }
    );
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({
      createdAt: -1,
    });
    res.send({
      success: true,
      message: 'Notifications read successfully',
      data: notifications,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//delete all notification

router.delete('/delete-all-notifications', authMiddleWare, async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.body.userId,
    });
    res.send({
      success: true,
      message: 'All notifications cleared ',
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
