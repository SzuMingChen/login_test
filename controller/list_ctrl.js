const list_model = require("../model/list_model");


//! todo_list主頁 並取得所有事項
exports.home = async (req, res) => {
  if (req.session.user) {
    // 初始化代辦事項
    let todo_list = [];

    //todo 從 Session 中讀取使用者資料
    const userInfo = req.session.user;
    console.log('使用者資訊', userInfo);

    //* 取得該帳號的所屬內容
    const result = await list_model.check_list(userInfo.user_account);

    //* 設定帳號內無留言狀況的初始值
    if (result == "") {
      todo_list.push({ id: '', body: '', name: userInfo.name });
    }
    //* 將該帳號的原有待辦資訊寫入
    for (let i = 0; i < result.length; i++) {
      todo_list.push({ id: result[i].id, body: result[i].body, name: userInfo.name });
    }
    console.log(`${userInfo.name}的待辦事項::`, todo_list);

    //* 將該帳號的待辦資訊回傳
    return res.render('list', { todo_list: todo_list });
  }

  //* 登入失敗，跳回主頁
  return res.redirect('/');

};

//! 新增待辦事項
exports.write_new_list = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  console.log('----進ctrl---->', req.body);
  //* 初始化代辦事項
  let todo_list = [];
  //todo 從 Session 中讀取使用者資料
  const user = JSON.stringify(req.session.user);
  const userInfo = JSON.parse(user);
  console.log(`- 使用者 ->`, userInfo);

  //* 寫入內容
  const body = req.body.new_item;
  const create = await list_model.create_list(
    userInfo.user_account,
    body,
    userInfo.name
  );

  // 成功
  if (create) {
    //* 取得該帳號的所屬內容
    const result = await list_model.check_list(userInfo.user_account);
    for (let i = 0; i < result.length; i++) {
      todo_list.push({ id: result[i].id, body: result[i].body, name: userInfo.name });
    }
    //* 將該帳號的待辦資訊回傳
    return res.render('list', { todo_list: todo_list });
  }
  // 失敗
  return res.status(404).send({ msg: "新增失敗!!" });
};

//! 刪除事項
exports.remove_my_list = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  console.log('----進ctrl---->', req.body);
  //todo 從 Session 中讀取使用者資料
  const user = JSON.stringify(req.session.user);
  const userInfo = JSON.parse(user);
  console.log(`- 使用者 ->`, userInfo);

  //* 取得文章內容，並進行軟刪除
  const id = req.body.id;

  const remove = await list_model.remove_list(id);

  //* 成功失敗回傳
  if (!remove) {
    return res.status(404).send({ msg: "刪除失敗" });
  }
  return res.redirect('/todo_list');
};

//! 更新事項
exports.edit_my_list = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  console.log('----進ctrl---->', req.body);
  //todo 從 Session 中讀取使用者資料
  const user = JSON.stringify(req.session.user);
  const userInfo = JSON.parse(user);
  console.log(`- 使用者 ->`, userInfo);

  //* 編輯新的內容
  const id = req.body.id;
  const value = req.body.body;
  const change = await list_model.edit_list(value, id);

  //* 成功失敗回傳
  if (!change) {
    return res.status(404).send({ msg: "編輯失敗" });
  }
  return res.redirect('/todo_list');
};

