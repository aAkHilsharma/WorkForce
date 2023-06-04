const router = require('express').Router();
const Project = require('../models/projectModel');
const authMiddleWare = require('../middlewares/authmiddleware');

// create a project
router.post('/create-project', authMiddleWare, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.send({
      success: true,
      data: newProject,
      message: 'Project Created Successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//get All Projects

router.post('/get-all-projects', authMiddleWare, async (req, res) => {
  try {
    const filters = req.body.filters;
    const projects = await Project.find(filters || {}).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

//get project by role
router.post('/get-projects-by-role', authMiddleWare, async (req, res) => {
  try {
    const userId = req.body.userId;
    const projects = await Project.find({ 'members.user': userId })
      .sort({
        createdAt: -1,
      })
      .populate('owner');
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get project by id
router.post('/get-project-by-id', authMiddleWare, async (req, res) => {
  try {
    const project = await Project.findById(req.body._id)
      .populate('owner')
      .populate('members.user');

    res.send({
      success: true,
      data: project,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

router.post('/edit-project', authMiddleWare, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: 'Project Updated successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

router.delete('/delete-project', authMiddleWare, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
