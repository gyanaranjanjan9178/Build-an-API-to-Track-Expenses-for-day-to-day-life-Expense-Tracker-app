Features:

1. User Authentication

Endpoints: /api/auth/register, /api/auth/login
Security: Passwords hashed using bcrypt
Token: JWT issued on login, used to protect all expense/report routes

2. Expense Management (CRUD)

Create: POST /api/expenses
Read: GET /api/expenses?page=1&limit=10&sort=amount&filter[category]=Food&filter[date]=2025-07-18
Update: PUT /api/expenses/:id
Delete: DELETE /api/expenses/:id
Fields: title, amount, date, category, optional note, image URL
Advanced: Filtering (category, date), sorting (amount/date), pagination

3. Receipt Upload

Library: Multer
Storage: Local or Cloudinary (based on config)
Endpoint: Part of POST /api/expenses
Validation: Accepts only image formats (jpeg/png/webp)

4. Background Job - Reports

Library: Bull, Redis
Trigger: On registration or POST /api/reports
Job: Simulate weekly expense summary via email
Log: Console log "Email sent to user@example.com"

5. Error Handling and Logging

Middleware: Centralized error handler
Logs: morgan for HTTP logs, winston optional for structured logs

6. SMS Notification

Trigger: If user’s monthly expense crosses limit (e.g., ₹50,000)
Integration: Sample Twilio config and  also using nodemailer
Action: Logs alert SMS message to user on threshold breach or via email


 Tech Stack:

Node.js, Express
PostgreSQL, Sequelize
Cloudinary (for receipts)
Bull + Redis (for jobs/queues)
Twilio (mock SMS logs)
JWT + Bcrypt (auth/security)
Multer (image middleware)


Server Information:
Base URL: http://localhost:5000
Port: 5000
Environment: development
Database: PostgreSQL
start:npm run dev

API Endpoints:

 Auth (/api/auth)
Method	Endpoint	Description
POST	/register	Register new user
POST	/login	    Login and get JWT

 Expenses (/api/expenses):
Method	Endpoint	   Description
POST	 /	           Add a new expense
GET	     /	            Get expenses with pagination/filter
GET 	/:id	        Get expense by ID
PUT	    /:id	        Update expense
DELETE	/:id	        Delete expense

Filtering: ?category=Food&date=2025-07-18
Sorting: ?sort=amount|date
Pagination: ?page=1&limit=10



 Uploads (/api/upload)
Method	Endpoint	Description
POST	/receipt	Upload receipt image

Multer is used for local upload.
Cloudinary integration supported via .env.

 Reports (/api/reports)
Method	Endpoint	    Description
GET	     /              weekly	Get weekly expense report
Automatically generated using Bull queue and Redis every 7 days.

Twilio SMS Alert (optional)
If total monthly expenses exceed a defined threshold (e.g., ₹10,000), an SMS notification will be triggered using Twilio.
these are set in your .env:

Node.js + Express
PostgreSQL with Sequelize
JWT Authentication
Multer + Cloudinary for image uploads
Bull + Redis for background jobs
Twilio for SMS
Socket.IO (optional real-time support)
Morgan, Winston for logging

Environment Variables (.env):
PORT=5000
DB_HOST=localhost
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASS=yourpassword

JWT_SECRET=supersecretkey
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
ALERT_PHONE_NUMBER=+918765432100
