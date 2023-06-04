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
    const projects = await Project.find(filters || {});
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

module.exports = router;
