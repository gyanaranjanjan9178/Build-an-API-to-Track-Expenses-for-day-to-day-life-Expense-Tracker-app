// const express = require('express');
// const app = express();
// const logger = require('./utils/logger');
// const errorMiddleware = require('./middlewares/error.middleware');

// app.use(express.json());

// logger.info('App started'); 

// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/expenses', require('./routes/expense.routes'));
// app.use('/api/reports', require('./routes/report.routes'));

// app.use(errorMiddleware);

// module.exports = app;

// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');
const reportRoutes = require('./routes/report.routes'); // <-- check this
const expenseRoutes = require('./routes/expense.routes');
const uploadRoutes = require('./routes/upload.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');


dotenv.config();

const app = express();


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api', uploadRoutes);


app.use(errorMiddleware);

logger.info('App started');

module.exports = app;
