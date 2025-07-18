const { Expense, User } = require('../models');
const cloudinary = require('../config/cloudinary');
const twilioClient = require('../config/twilio');
const { Op } = require('sequelize');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

exports.createExpense = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const expense = await Expense.create({
      ...req.body,
      imageUrl,
      UserId: req.user.id,
    });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const { sum } = await Expense.findOne({
      attributes: [[Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'sum']],
      where: {
        UserId: req.user.id,
        date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
      raw: true,
    });

    if (parseFloat(sum) > 50000) {
      const user = await User.findByPk(req.user.id);

      if (user && user.phoneNumber) {
        await twilioClient.messages.create({
          body: ` Alert: Your total expenses this month have crossed ₹50,000.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phoneNumber,
        });

        console.log(`SMS sent to ${user.phoneNumber}`);
      }
    }

    res.status(201).json({ success: true, expense });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

//   ---- this is also using email----

// const transporter = require('../config/nodemailer');

// exports.createExpense = async (req, res) => {
//   try {
//     let imageUrl = null;

//     if (req.file) {
//       const result = await uploadToCloudinary(req.file.buffer);
//       imageUrl = result.secure_url;
//     }

//     const expense = await Expense.create({
//       ...req.body,
//       imageUrl,
//       UserId: req.user.id,
//     });

//     const currentMonth = new Date().getMonth();
//     const currentYear = new Date().getFullYear();

//     const expensesThisMonth = await Expense.findAll({
//       where: {
//         UserId: req.user.id,
//         date: {
//           [require('sequelize').Op.between]: [
//             new Date(currentYear, currentMonth, 1),
//             new Date(currentYear, currentMonth + 1, 0)
//           ]
//         }
//       }
//     });

//     const totalAmount = expensesThisMonth.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

//     if (totalAmount > 50000) {
//       const user = await User.findByPk(req.user.id);

//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: ' Expense Limit Alert',
//         html: `<p>Hi ${user.name || 'User'},</p>
//                <p>You’ve crossed your monthly expense limit of ₹50,000.</p>
//                <p><strong>Total Spent:</strong> ₹${totalAmount}</p>
//                <p>Please review your expenses on your dashboard.</p>
//                <br/><p>– Expense Tracker</p>`
//       };

//       await transporter.sendMail(mailOptions);
//       console.log(`Email sent to ${user.email}: Limit exceeded (₹${totalAmount})`);
//     }

//     res.status(201).json({ success: true, expense });

//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };


exports.getExpenses = async (req, res) => {
  const { page = 1, limit = 10, category, sort = 'date_desc' } = req.query;
  const offset = (page - 1) * limit;
  const where = { UserId: req.user.id };
  if (category) where.category = category;
  const order = [
    [sort.includes('amount') ? 'amount' : 'date', sort.includes('desc') ? 'DESC' : 'ASC']
  ];
  const expenses = await Expense.findAndCountAll({ where, limit: +limit, offset: +offset, order });
  res.json({ success: true, expenses });
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });

    await expense.update(req.body);
    res.json({ success: true, expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });

    await expense.destroy();
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
