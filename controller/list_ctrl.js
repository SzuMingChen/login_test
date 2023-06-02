const list_model = require("../model/list_model");


//! todo_list主頁 並取得所有事項
exports.home = async (req, res) => {
  if (req.session.user === undefined) {
    return res.render("login", { title: '請重新登入!!' });;
  }
    // 初始化代辦事項
    let todo_list = [];

    //todo 從 Session 中讀取使用者資料
    const user_info = req.session.user;
    console.log('使用者資訊', req.session);

    //* 取得該帳號的所屬內容
    const result = await list_model.check_list(user_info.user_account);

    //* 設定帳號內無留言狀況的初始值
    if (result == "") {
      todo_list.push({ id: '', body: '', name: user_info.name });
    }
    //* 將該帳號的原有待辦資訊寫入
    for (let i = 0; i < result.length; i++) {
      todo_list.push({ id: result[i].id, body: result[i].body, name: user_info.name });
    }
    // console.log(`${user_info.name}的待辦事項::`, todo_list);

    //* 將該帳號的待辦資訊回傳
    return res.render('list', { todo_list: todo_list });
};

//! 新增待辦事項
exports.write_new_list = async (req, res) => {
  if (req.session.user === undefined) {
    return res.render("login", { title: '請重新登入!!' });;
  }
  // console.log('----進ctrl---->', req.body);
  //* 初始化代辦事項
  let todo_list = [];
  //todo 從 Session 中讀取使用者資料
  const user = JSON.stringify(req.session.user);
  const user_info = JSON.parse(user);
  console.log(`- 使用者 ->`, user_info);

  //* 寫入內容
  const body = req.body.new_item;
  const create = await list_model.create_list(
    user_info.user_account,
    body,
    user_info.name
  );

  // 成功
  if (create) {
    //* 取得該帳號的所屬內容
    const result = await list_model.check_list(user_info.user_account);
    for (let i = 0; i < result.length; i++) {
      todo_list.push({ id: result[i].id, body: result[i].body, name: user_info.name });
    }
    //* 將該帳號的待辦資訊回傳
    return res.render('list', { todo_list: todo_list });
  }
  // 失敗
  return res.render("login", { title: '不明原因故障，請重新登入!!' });
};

//! 刪除事項
exports.remove_my_list = async (req, res) => {
  if (req.session.user === undefined) {
    return res.render("login", { title: '請重新登入!!' });;
  }
  // console.log('----進ctrl---->', req.body);

  //* 取得文章內容，並進行軟刪除
  const id = req.body.id;

  const remove = await list_model.remove_list(id);

  //* 成功失敗回傳
  if (!remove) {
    return res.render("login", { title: '不明原因故障，請重新登入!!' });
  }
  return res.redirect('/api/todo_list');
};

//! 更新事項
exports.edit_my_list = async (req, res) => {
  if (req.session.user === undefined) {
    return res.render("login", { title: '請重新登入!!' });;
  }
  // console.log('----進ctrl---->', req.body);

  //* 編輯新的內容
  const id = req.body.id;
  const value = req.body.body;
  const change = await list_model.edit_list(value, id);

  //* 成功失敗回傳
  if (!change) {
    return res.render("login", { title: '不明原因故障，請重新登入!!' });
  }
  return res.redirect('/api/todo_list');
};

