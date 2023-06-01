const { log } = require("console");
const model = require("../model/user_model");
const model_list = require('../model/list_model');
const crypto = require("crypto");

// 初始化代辦事項
let toDoList = [];

//! 起始頁面
exports.home = async (req, res) => {
  res.render("login", { title: '登入頁' });
};

//! 登入
exports.login_account = async (req, res) => {
  console.log('----進ctrl---->', req.body);
  //* new hash
  const hash = crypto.createHash("md5");
  const { user_account, password } = req.body;
  //* 加密
  const password_ans = hash.update(password).digest("hex");
  //* 查找現有帳號確認有無註冊 
  const [check_account] = await model.check_account(user_account, password_ans);
  console.log('----ctrl回---->', check_account);
  if (!check_account) return res.render("login", { title: '帳號密碼輸入錯誤!!' });
  //* 判斷密碼有無輸入錯誤
  if (check_account.password !== password_ans) return res.render("login", { title: '帳號密碼輸入錯誤!!' });

  //todo 在登入成功後，將使用者資料存儲到 Session 中
  req.session.user = { user_account: check_account.user_account, name: check_account.name };

  //* 成功就跳轉至todo_list頁面
  return res.redirect('/api/todolist');
};

//! 創建
exports.create_account = async (req, res) => {
  //* new hash
  const hash = crypto.createHash("md5");
  const { name, user_account, password, password_again } = req.body;
  //* 阻擋密碼輸入不一致
  if (password !== password_again)
    return res.render("register", { title: '密碼不一致!!' });
  //* 查找現有帳號及暱稱，確認有無重複註冊 
  const check_account = await model.search_account();
  console.log('----ctrl回---->', check_account);
  for (let i = 0; i < check_account.length; i++) {
    if (user_account === check_account[i].user_account) {
      return res.render("register", { title: '帳號已被註冊!!' });
    }
    if (name === check_account[i].name) {
      return res.render("register", { title: '暱稱已被註冊!!' });
    }
  }
  //* 加密
  const password_ans = hash.update(password).digest("hex");
  //* 以上確認完成後執行註冊 
  const status = 1;
  const result = await model.create_account(
    user_account,
    password_ans,
    name,
    status
  );
  console.log('----ctrl回---->', result);
  if (result) {
    return res.render("login", { title: '註冊成功!! 請直接登入' });
  }
  return res.render("register", { title: '不明原因導致註冊失敗!!' });

};

//! 修改
exports.edit_account = async (req, res) => {
  console.log('----進ctrl---->', req.body);
  const { user_account, new_password, check_new_password } = req.body;
  //* 暫定只能修改密碼
  if (new_password !== check_new_password) {
    return res.render("forgot", { title: '密碼不一致!!' });
  }
  //* 目前暫定只能修改密碼 加密舊數值與新數值
  const hash = crypto.createHash("md5");
  const new_password_ans = hash.update(new_password).digest("hex");

  //* 撈舊帳號
  const check = await model.check_account(user_account);
  console.log("----ctrl回---->", check);
  if (!check) {
    return res.render("forgot", { title: '帳號輸入錯誤!!' });
  }

  //* 更新密碼
  const result = await model.edit_account(new_password_ans, user_account);
  if (!result) {
    return res.render("forgot", { title: '更新失敗!!' });
  }
  return res.render("login", { title: '更新成功!! 請直接登入' });
};

//! 登出
exports.logout_account = async (req, res) => {

};



