const express = require('express');
const multer = require('multer');
const { uploadFiles } = require('../controllers/profileControllers');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.array('files'), uploadFiles);

module.exports = router;
