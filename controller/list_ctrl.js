const model = require("../model/list_model");
const model_ctrl = require("../model/user_model");

//! todolist主頁 並取得所有事項
exports.home = async (req, res) => {
  // 初始化代辦事項
  let toDoList = [];

  //todo 從 Session 中讀取使用者資料
  const userInfo = req.session.user;
  console.log('使用者資訊', userInfo);

  //todo 獲取 session ID
  const sessionID = req.sessionID;
  console.log(`- 使用者 [ ${userInfo.name} ] => sessionID:${sessionID}`);

  //* 取得該帳號的所屬內容
  const result = await model.check_list(userInfo.user_account);

  for (let i = 0; i < result.length; i++) {
    console.log('近來摟！！', result[i]);
    toDoList.push({ id:result[i].id, body:result[i].body});
  }
  console.log('now~~',toDoList);

  //* 將該帳號的待辦資訊回傳
  return res.render('todolist', { toDoList: toDoList });
};

//! 新增待辦事項
exports.write_new_list = async (req, res) => {
  console.log('----進ctrl---->', req.body);
  //* 初始化代辦事項
  let toDoList = [];
  //todo 從 Session 中讀取使用者資料
  const user = JSON.stringify(req.session.user);
  const userInfo = JSON.parse(user);
  console.log(`- 使用者 ->`, userInfo);
  if (userInfo.user_account === undefined) {
    return res.send("尚未登入")
  }
  //* 寫入內容
  const body = req.body.new_item;
  const delete_status = 1;
  const create = await model.create_list(
    userInfo.user_account,
    body,
    userInfo.name,
    delete_status
  );
 // 成功
  if (create) {
    //* 取得該帳號的所屬內容
    const result = await model.check_list(userInfo.user_account);
    for (let i = 0; i < result.length; i++) {
      toDoList.push({ id:result[i].id, body:result[i].body});
    }
    //* 將該帳號的待辦資訊回傳
    return res.render('todolist', { toDoList: toDoList });
  }
// 失敗
  return res.send({ msg: "新增失敗!!" });
};

//! 刪除事項
exports.remove_my_list = async (req, res) => {
  console.log('----進ctrl---->', req.body);
  //todo 從 Session 中讀取使用者資料
  const user = JSON.stringify(req.session.user);
  const userInfo = JSON.parse(user);
  console.log(`- 使用者 ->`, userInfo);
  if (userInfo.user_account === undefined) {
    return res.send("尚未登入")
  }
  //* 取得文章內容，並進行軟刪除
  const id = req.body.id;

  const remove = await model.remove_list(id);

  if (!remove) {
    return res.status(404).send({ msg: "刪除失敗" });
  }
  return res.redirect('/api/todolist');
};

//! 更新事項
exports.edit_my_list = async (req, res) => {
  console.log('----進ctrl---->', req.body);
  //todo 從 Session 中讀取使用者資料
  const user = JSON.stringify(req.session.user);
  const userInfo = JSON.parse(user);
  console.log(`- 使用者 ->`, userInfo);
  if (userInfo.user_account === undefined) {
    return res.send("尚未登入")
  }
  const id = req.body.id;
  const value = req.body.body;
  const user_account = userInfo.user_account;

  const change = await model.edit_list(value, id);

  const result = await model.check_list(user_account);

  console.log("---ctrl_remove_list--->", result);
  if (!result) {
    return res.status(404).send({ msg: "更新失敗" });
  }
  return res.redirect('/api/todolist');
};

