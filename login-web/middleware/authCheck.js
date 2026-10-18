// Chặn truy cập nếu chưa đăng nhập
module.exports.requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login.html');
  }
  next();
};
