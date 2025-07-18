const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { uploadReceipt } = require('../controllers/upload.controller');


router.post('/upload', upload.single('receiptImage'), uploadReceipt);

module.exports = router;
