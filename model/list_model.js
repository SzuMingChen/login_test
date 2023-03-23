const mysql = require("../config/mysql");

const model = {
  //! 查
  check_list: async (user_account) => {
    const transaction = await mysql.getConnection();
    try {
      await transaction.beginTransaction();
      //* 併表查詢
      const target = `SELECT *
    FROM todo_list.user_account_table
    JOIN todo_list.todo_list_table ON user_account_table.user_account = todo_list_table.user_account
    WHERE todo_list_table.user_account = '${user_account}' AND status = 1 AND delete_status = 1;
    `;

      const [result] = await mysql.execute(target);

      console.log("---model_check_list--->", result);

      await transaction.commit();
      transaction.release();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  //! 增
  create_list: async (user_account, title, body, name, delete_status) => {
    const transaction = await mysql.getConnection();
    try {
      await transaction.beginTransaction();
      const target = `INSERT INTO todo_list.todo_list_table (user_account, title, body, name, delete_status) VALUES ('${user_account}', '${title}', '${body}', '${name}', '${delete_status}');
      `;

      const result = await mysql.execute(target);

      console.log("---model_create_list--->", result);
      await transaction.commit();
      transaction.release();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  //! 刪
  remove_list: async (list_id) => {
    const transaction = await mysql.getConnection();
    try {
      await transaction.beginTransaction();
      const target = `UPDATE todo_list.todo_list_table SET delete_status = '0', list_update_time = NOW() WHERE (id = '${list_id}');
      `;

      const result = await mysql.execute(target);

      console.log("---model_remove_list--->", result);
      await transaction.commit();
      transaction.release();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  //! 改
  edit_list: async (value, list_id) => {
    const transaction = await mysql.getConnection();
    try {
      await transaction.beginTransaction();
      const target = `UPDATE todo_list.todo_list_table SET body = '${value}', list_update_time = NOW() WHERE (id = '${list_id}');
      `;
      const result = await mysql.execute(target);

      console.log("---model_edit_list--->", result);
      await transaction.commit();
      transaction.release();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

module.exports = model;
