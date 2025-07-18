const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');

router.use(authMiddleware);

router.post('/', upload.single('receiptImage'),createExpense);

router.get('/',getExpenses);
router.get('/:id',getExpenseById);
router.put('/:id',updateExpense);
router.delete('/:id',deleteExpense);


module.exports = router;


