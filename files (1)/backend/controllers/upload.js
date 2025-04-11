const multer = require('multer');
const fs = require('fs');
const { google } = require('googleapis');
const User = require('../models/user');

// Multer Configuration
const upload = multer({ dest: 'uploads/' });

// Upload Video
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { file } = req;
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).send('User not found');
    if (!file) return res.status(400).send('No file uploaded');

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: user.accessToken });

    const youtube = google.youtube({ version: 'v3', auth });
    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus: 'public' }
      },
      media: {
        body: fs.createReadStream(file.path)
      }
    });

    // Delete file after upload
    fs.unlinkSync(file.path);

    res.status(200).json({ videoId: response.data.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.uploadMiddleware = upload.single('video');