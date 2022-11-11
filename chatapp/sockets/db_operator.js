'use strict';

const User = require("../libs/database/users");

module.exports = function (socket) {
    // ユーザIDの取得
    socket.on('getUserID', function (data) {
        // ユーザ作成(取得)
        let user_data = {}
        const user_current = new User({ user_name: data });
        User.readByName(data).then((V) => {
            console.log("resolve", V)
            socket.emit('reciveGetUserID', V["user_id"])
        }).catch(V => {
            console.log("reject", V)
            user_current.create().then((V) => {
                user_data = V;
                socket.emit('reciveGetUserID', V["user_id"])
            });
        })
    });
    // ユーザの名前の取得
    socket.on('getUserName', function (data) {
        // ユーザ作成(取得)  
        User.readById(data).then((V) => {
            console.log("resolve getUserName", V)
            socket.emit('reciveGetUserName', V["user_name"])
        }).catch(V => {
            console.log("reject", V)
            socket.emit('reciveGetUserName', "")
        })
    });
};
