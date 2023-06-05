const router = require('express').Router();

const authMiddleWare = require('../middlewares/authmiddleware');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

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
    // Object.keys(req.body).forEach((key) => {
    //   if (req.body[key] === 'all') {
    //     delete req.body[key];
    //   }
    // });
    // delete req.body['userId'];
    const tasks = await Task.find(req.body.filters)
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

module.exports = router;
