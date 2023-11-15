const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router/router");
const session = require("express-session");
const port = 3000;
const app = express();

//* 啟動ejs
const engine = require("ejs-locals");
app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");

//* session 需注意use擺放順序
app.use(session({
  secret: 'your_secret_key', //! 用於簽署和加密 Session 的 Cookie，請將其替換為你自己的密鑰。
  resave: false, //! 設置是否在每次請求時強制重新保存 Session，設為 false 表示僅在 Session 有更改時才保存。
  saveUninitialized: false, //! 設置是否在初始化期間保存未修改的 Session，設為 false 表示僅在 Session 有修改時才保存。
  cookie: { //! 設定 Session 的 Cookie 選項，例如安全性、有效期等。
      secure: false, //! 用於指定是否僅在使用安全連接（HTTPS）時才傳送 Cookie。
      maxAge: 100000 //! Session 的有效日期。
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//* 路徑
app.use(router);

//* 啟動進入初始頁面
app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}/`);
});
