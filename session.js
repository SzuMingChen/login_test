
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
