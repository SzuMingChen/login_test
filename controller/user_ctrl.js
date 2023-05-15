const model = require("../model/user_model");
const crypto = require("crypto");

const controller = {
  //! 登入
  login_account: async (req, res) => {
    console.log('進來了!',req.body);
    //* new hash
    const hash = crypto.createHash("md5");
    const { user_account, password } = req.body;
    const result = await model.check_account(user_account);
    console.log("---ctrl_login--->", result);
    //* 加密
    const password_ans = hash.update(password).digest("hex");
    if (!result || result == "") {
      return res.status(404).send({ error: "登入失敗" });
    } else if (result) {
      if (result[0].password !== password_ans) {
        return res.status(404).send({ error: "密碼輸入錯誤" });
      }
      return res.status(200).send({ msg: "登入成功" });
    }
  },
  //! 創建
  //! 目前重複創建已關閉的帳號會壞掉
  create_account: async (req, res) => {
    //* new hash
    const hash = crypto.createHash("md5");
    const { user_account, password, password_again, name } = req.body;
    //* 阻擋密碼輸入不一致
    if (password !== password_again)
      return res.status(404).send({ error: "密碼不一致" });
    const status = 1;
    //* 確認有無重複註冊
    const check_account = await model.check_account(user_account);
    console.log('11111',check_account);
    //* 加密
    const password_ans = hash.update(password).digest("hex");
    if (!check_account || check_account == "") {
      const result = await model.create_account(
        user_account,
        password_ans,
        name,
        status
      );
      if (result === true) {
        return res.status(200).send({ msg: "創建成功" });
      }
      return res.status(404).send({ error: "創建失敗" });
    }
    if (check_account) return res.status(404).send({ error: "帳號重複" });
  },
  //! 刪除
  close_account: async (req, res) => {
    const { user_account } = req.body;
    const check = await model.check_account(user_account);
    console.log("---ctrl_check--->", check);
    if (check) {
      const result = await model.close_account(user_account);
      console.log("---ctrl_edit--->", result);
      if (!result) {
        return res.status(404).send({ error: "刪除失敗" });
      }
      return res.status(200).send({ msg: "帳號刪除成功" });
    }
    return res.status(404).send({ error: "查無此帳號" });
  },
  //! 修改
  edit_account: async (req, res) => {
    const { user_account, old_value, new_value } = req.body;
    //* 目前暫定只能修改密碼 加密舊數值與新數值
    const hash = crypto.createHash("md5");
    const old_value_ans = hash.update(old_value).digest("hex");
    const hash2 = crypto.createHash("md5");
    const new_value_ans = hash2.update(new_value).digest("hex");
    //* 撈舊數值
    const check = await model.check_account(user_account);
    if (!check || check == "") {
      return res.status(404).send({ error: "編輯數值異常" });
    }
    //* 暫定只能修改密碼
    if (check[0].password !== old_value_ans) {
      return res.status(404).send({ error: "與舊數值不相符" });
    }

    const result = await model.edit_account(new_value_ans, user_account);
    if (!result) {
      return res.status(404).send({ error: "編輯失敗" });
    }
    return res.status(200).send({ msg: "編輯成功" });
  },
  //! 登出
  logout_account: async(req, res) => {

  },
};

module.exports = controller;
