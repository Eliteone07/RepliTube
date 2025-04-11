const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');

router.post('/video/:userId', uploadController.uploadMiddleware, uploadController.uploadVideo);

module.exports = router;