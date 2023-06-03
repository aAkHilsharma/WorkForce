require('dotenv').config();
const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authmiddleware = require('../middlewares/authmiddleware');

//register a new user
router.post('/register', async (req, res) => {
  try {
    //check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      res.send({
        success: false,
        message: 'User already exists',
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;

      // save the user
      const user = new User(req.body);
      await user.save();
      res.send({
        success: true,
        message: 'User registered successfully',
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//login a user
router.post('/login', async (req, res) => {
  try {
    //check if user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('User does not exists');
    }

    //check if password is correct
    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCorrect) {
      throw new Error('Invalid Password');
    }

    // create and assign token
    const token = jwt.sign({ userId: user._id }, `${process.env.jwt_secret}`, {
      expiresIn: '1d',
    });
    res.send({
      success: true,
      data: token,
      message: 'User logged in successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get('/get-logged-in-user', authmiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    //remove password from the user object
    user.password = undefined;

    res.send({
      success: true,
      data: user,
      message: 'User fetched successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
