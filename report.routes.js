
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { sendReport, generateReport } = require('../controllers/report.controller');

router.use(auth);

router.post('/', sendReport);
router.post('/', authMiddleware, sendReport);
router.post('/generate', generateReport);
router.post('/ping', (req, res) => {
  return res.json({ message: 'Report route is working!' });
});

module.exports = router;
