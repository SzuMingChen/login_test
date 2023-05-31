const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router/router");
const session = require("express-session");
const port = 3000;
const app = express();
app.use(session({ secret: "1234", resave: false, saveUninitialized: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 啟動ejs
const engine = require("ejs-locals");
app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");

// 起始頁面
app.get("/", function (req, res) {
  res.render("login", { title: '登入頁' });
});

app.use("/api", router);


app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});
