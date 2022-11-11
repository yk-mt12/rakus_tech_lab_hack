'use strict';

const Room = require("../libs/database/rooms");
const User = require("../libs/database/users");


module.exports = function (socket) {

    socket.on('sendTheme', function (data) {
        if (!data) {
            //デバッグ作業がしやすいようにエラーログを吐く
            console.error('The chat data is empty.');
            return;
        }
    
        //送信されたデータの型をチェック
        if (typeof data !== 'object') {
            console.error('The chat data is not object.');
            return;
        }
    
        //送信されたデータのバリデーション等
        const data_keys = Object.keys(data);
        if(!(data_keys.includes('user_id') && data_keys.includes('theme'))){
            console.error('The chat data is corrupted.');
            return;
        }
    
        console.log('user_id:' + data.user_id);
        console.log('theme:' + data.theme);
        // お題の登録
        const new_room = new Room({room_name:data.theme,user_id:data.user_id})
        console.log("this is enter")
        new_room.create().then(V =>{
                console.log("succes reate theme", data.theme);
                socket.emit("receiveTheme", data.theme);
            })
            .catch(V =>{
                console.log(V)
                socket.emit("receiveTheme", "");
            });
        console.log('this is end')
    })
};
