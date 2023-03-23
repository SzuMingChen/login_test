const mysql = require("../config/mysql");

const model = {
  //! 查
  check_account: async (user_account) => {
    const transaction = await mysql.getConnection();
    try {
      //* 啟動
      await transaction.beginTransaction();
      const target = `SELECT * FROM user_account_table WHERE \`user_account\` = '${user_account}' AND \`status\` = '1'`;
      const [result] = await mysql.execute(target);
      console.log("---model_check--->", result);
      //*
      await transaction.commit();
      transaction.release();
      return result;
    } catch (error) {
      if (!result || result == "") {
        return false;
      }
      //* 回逤
      await transaction.rollback();
      throw error;
    }
  },
  //! 增
  create_account: async (user_account, password, name, status) => {
    const transaction = await mysql.getConnection();
    try {
      await transaction.beginTransaction();
      const target = `INSERT INTO \`user_account_table\` (\`user_account\`, \`password\`, \`name\`, \`status\`) VALUES ('${user_account}', '${password}', '${name}', ${status})`;
      const [result] = await mysql.execute(target);
      console.log("---model_create--->", result);
      if (result.affectedRows === 1) {
        return true;
      }
      await transaction.commit();
      transaction.release();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  //! 刪
  close_account: async (user_account) => {
    const transaction = await mysql.getConnection();
    try {
      const target = `UPDATE todo_list.user_account_table SET status = 0, account_update_time = NOW()  WHERE (user_account = '${user_account}');`;
      const [result] = await mysql.execute(target);
      console.log("---model_close--->", result);
      if (result.changedRows !== 0) {
        return true;
      }
      await transaction.commit();
      transaction.release();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  //! 改
  edit_account: async (new_value, user_account) => {
    const transaction = await mysql.getConnection();
    try {
      const update = `UPDATE todo_list.user_account_table SET \`password\` = '${new_value}', account_update_time = NOW()  WHERE (\`user_account\` = '${user_account}');`;
      const result = await mysql.execute(update);
      console.log("---model_edit--->", result);
      await transaction.commit();
      transaction.release();
      if (!result) {
        return false;
      }
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

module.exports = model;
