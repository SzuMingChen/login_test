const express = require('express');
const session = require('express-session');
const app = express()
const port = 3000

app.get('/', (req, res) => {

    res.send('<a href="./login/jasmine/123456/js"> login </a>')
})

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})

app.use(session({
    secret: 'your_secret_key', //! 用於簽署和加密 Session 的 Cookie，請將其替換為你自己的密鑰。
    resave: false, //! 設置是否在每次請求時強制重新保存 Session，設為 false 表示僅在 Session 有更改時才保存。
    saveUninitialized: false, //! 設置是否在初始化期間保存未修改的 Session，設為 false 表示僅在 Session 有修改時才保存。
    cookie: { //! 設定 Session 的 Cookie 選項，例如安全性、有效期等。
        secure: false, //! 用於指定是否僅在使用安全連接（HTTPS）時才傳送 Cookie。
        maxAge: 600000 //! Session 的有效日期。
    }
}));

app.get('/wer', (req, res) => {
    //step 資料整理

    //step 資料驗證

    //step 動作

    //step 回傳結果
    res.send()
})


app.get('/login/:account/:password/:name', (req, res) => {
    //step 驗證帳號
    const userAccount = req.params;
    console.log('11111111',userAccount);

    //! 在登入成功後，將使用者資料存儲到 Session 中
    req.session.user = { account: req.params.account, name: req.params.name };

    //! 獲取 session ID
    const sessionID = req.sessionID;
    console.log(`使用者 [ ${req.params.name} ] => ${sessionID}`);
    res.redirect('/profile');
});

app.get('/profile', (req, res) => {
    //! 獲取 session ID
    const sessionID = req.sessionID;
    console.log('22222222',sessionID);

    //! 從 Session 中讀取使用者資料
    const userInfo = req.session.user;
    console.log('33333333',userInfo);

    console.log(`-profile- 使用者 [ ${userInfo?.name} ] => ${sessionID}`);

    res.send(`Welcome ${userInfo?.name}`);
});

app.get('/game', (req, res) => {
    //! 從 Session 中讀取使用者資料
    const userInfo = req?.session.user;
    console.log(`-game- 使用者 [ ${JSON.stringify(userInfo)} ]`);
    if (userInfo === undefined) {
        return res.send("尚未登入")
    }


    //step 查詢DB資料
    // let allUserList =  txtRead();
    let allUserList = [
        { account: "koisme", password: "ko12345678", name: "KO", level: 5 },
        { account: "oep", password: "werw", name: "哭哭", level: 1 }
    ];

    //!比對帳號
    for (let i = 0; i < allUserList.length; i++) {
        const userData = allUserList[i];
        if (userData.account === userInfo.account) {
            return res.send(`${userData.name}: Lv ${userData.level}`)
        }


    }
    res.send("ok")
})


//# 取得 session store
const sessionStore = session.Store;

//# 取得所有儲存的 session 資料
sessionStore.prototype.getAllSessions = function (callback) {
    //! 使用 session store 的方法來獲取所有儲存的 session 資料
    this.all((error, sessions) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, sessions);
        }
    });
};

//# 路由端點，用於檢視所有儲存的 session 資料
app.get('/sessions', (req, res) => {
    //! 使用 session store 的方法取得所有儲存的 session 資料
    req.sessionStore.getAllSessions((error, sessions) => {
        if (error) {
            res.status(500).send('Error retrieving sessions');
        } else {
            res.json(sessions);
        }
    });
});
