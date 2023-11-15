-- Active: 1700014186475@@127.0.0.1@3306@login
CREATE TABLE `user_account_table` (
   `user_account` VARCHAR(255) NOT NULL COMMENT '帳號',
   `password` VARCHAR(255) DEFAULT '' COMMENT '密碼',
   `name` VARCHAR(255) DEFAULT '' COMMENT '名稱',
   `status` TINYINT NOT NULL DEFAULT '0' COMMENT '帳號狀態, 0:關閉;  1:創建',
   `account_update_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='帳號資訊';

CREATE TABLE `todo_list_table` (
   `user_account` VARCHAR(255) NOT NULL COMMENT '帳號',
   `body` VARCHAR(255) DEFAULT '' COMMENT '代辦內容',
   `name` VARCHAR(255) DEFAULT '' COMMENT '名稱',
   `delete_status` TINYINT NOT NULL DEFAULT '0' COMMENT '文章狀態, 0:創建;  1:關閉',
   `list_update_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='代辦項目';
