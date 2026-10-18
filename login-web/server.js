require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const { requireLogin } = require('./middleware/authCheck');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 ngày
}));

app.use('/api/auth', authRoutes);

// Bảo vệ trang dashboard - phải đăng nhập mới vào được
app.get('/dashboard.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.use(express.static('public'));

(async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${process.env.PORT}`);
  });
})();
