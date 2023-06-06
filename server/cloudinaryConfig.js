const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.c_cloud_name,
  api_key: process.env.c_api_key,
  api_secret: process.env.c_api_secret,
});

module.exports = cloudinary;
