const model = require("../model/list_model");
const model_ctrl = require("../model/user_model");

const controller = {
  //! 取得所有事項
  get_all_list: async (req, res) => {
    const { user_account } = req.query;

    const result = await model.check_list(user_account);
    //* 回傳前端格式
    const list = result.map((data) => {
      return {
        暱稱: data?.name,
        主題: data?.title,
        內容: data?.body,
        文章編號: data?.id,
      };
    });

    console.log("---ctrl_get_list--->", list);
    if (!list || list == "") {
      return res.status(404).send({ msg: "載入失敗" });
    }
    return res.status(200).send(list);
  },
  //! 新增待辦事項
  write_new_list: async (req, res) => {
    const { title, body } = req.body;
    const { user_account } = req.query;
    const delete_status = 1;
    //* 查找暱稱 從user_ctrl_model
    const [check] = await model_ctrl.check_account(user_account);

    const name = check.name;

    //* 寫入內容
    const create = await model.create_list(
      user_account,
      title,
      body,
      name,
      delete_status
    );

    if (create) {
      const result = await model.check_list(user_account);

      console.log("---ctrl_create_list--->", result);
      if (!result || result == "") {
        return res.status(404).send({ msg: "新增失敗" });
      }
      return res.status(200).send({ msg: "新增成功" });
    }
  },
  //! 刪除事項
  remove_my_list: async (req, res) => {
    const { id } = req.body;
    const { user_account } = req.query;

    const remove = await model.remove_list(id);

    const result = await model.check_list(user_account);

    console.log("---ctrl_remove_list--->", result);
    if (!result || result == "") {
      return res.status(404).send({ msg: "刪除失敗" });
    }
    return res.status(200).send({ msg: "刪除成功" });
  },
  //! 更新事項
  edit_my_list: async (req, res) => {
    const { id, value } = req.body;
    const { user_account } = req.query;

    const change = await model.edit_list(value, id);

    const result = await model.check_list(user_account);

    console.log("---ctrl_remove_list--->", result);
    if (!result || result == "") {
      return res.status(404).send({ msg: "更新失敗" });
    }
    return res.status(200).send({ msg: "更新成功" });
  },
};

module.exports = controller;
