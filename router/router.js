const express = require("express");
const user_ctrl = require("../controller/user_ctrl");
const router = express.Router();
const list_ctrl = require('../controller/list_ctrl');

module.exports =
//! 待 session 使用與前端畫面串接 && bug修正
//* user_account
router.post("/login", user_ctrl.login_account);
router.post("/create", user_ctrl.create_account);
router.post("/edit", user_ctrl.edit_account);
// router.post("/logout", user_ctrl.logout_account); 尚未製作

//* todo_list
router.get("/get", list_ctrl.get_all_list);
router.post("/write", user_ctrl.write_new_list);
router.post("/remove", list_ctrl.remove_my_list);
router.post("/change", list_ctrl.edit_my_list);

// 处理新增待办事项请求
 router.post('/add', (req, res) => {
    const newItem = req.body.newItem;
    toDoList.push(newItem);
    res.redirect('/');
  });
  // 处理编辑待办事项请求
  router.post('/edit', (req, res) => {
    const index = req.body.index;
    const updatedItem = req.body.updatedItem;
    toDoList[index] = updatedItem;
    res.redirect('/');
  });
  // 处理删除待办事项请求
  router.post('/delete', (req, res) => {
    const index = req.body.index;
    toDoList.splice(index, 1);
    res.redirect('/');
  });


//* 註冊頁面跳轉
router.get("/register", function (req, res) {
    res.render("register",{ title: '註冊頁' });
});
//* 忘記密碼頁面跳轉
router.get("/forgot", function (req, res) {
    res.render("forgot",{ title: '變更密碼頁面' });
});