const router = require('express').Router();

const authMiddleWare = require('../middlewares/authmiddleware');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const cloudinary = require('../cloudinaryConfig');
const multer = require('multer');

//create a task
router.post('/create-task', authMiddleWare, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.send({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//get all tasks
router.post('/get-all-tasks', authMiddleWare, async (req, res) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === 'all') {
        delete req.body[key];
      }
    });
    delete req.body['userId'];
    const tasks = await Task.find(req.body)
      .populate('assignedTo')
      .populate('assignedBy')
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update task
router.post('/update-task', authMiddleWare, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: 'Task updated successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// delete task
router.post('/delete-task', authMiddleWare, async (req, res) => {
  try {
    await Task.findByIdAndRemove(req.body._id);
    res.send({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//create multer storage
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

router.post(
  '/upload-image',
  authMiddleWare,
  multer({ storage: storage }).single('file'),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'tasks',
      });
      const imageUrl = result.secure_url;

      await Task.findOneAndUpdate(
        {
          _id: req.body.taskId,
        },
        {
          $push: {
            attachments: imageUrl,
          },
        }
      );

      res.send({
        success: true,
        message: 'Image uploaded successfully',
        data: imageUrl,
      });
    } catch (error) {
      res.send({
        success: false,
        error: error.message,
      });
    }
  }
);
module.exports = router;
