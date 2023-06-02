//! 起始頁面
exports.home = async (req, res) => {
  res.render("login", { title: 'To-Do List登入' });
};

//! 註冊頁面
exports.register = async (req, res) => {
  res.render("register", { title: '註冊' });
};

//! 忘記密碼頁面
exports.forgot = async (req, res) => {
  res.render("forgot", { title: '變更密碼' });
};