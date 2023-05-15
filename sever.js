const express = require("express");
const bodyParser = require("body-parser");
const api = require("./router/router");
const session = require("express-session");
const cors = require("cors");
const port = 3000;
const app = express();
// app.use(session({ secret: "1234", resave: false, saveUninitialized: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use("/user", api);

app.use("/", (req, res) => {
  res.send('Hello! world')
});



app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});
