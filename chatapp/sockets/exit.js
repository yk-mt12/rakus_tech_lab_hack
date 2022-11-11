'use strict';

module.exports = function (socket) {
    // 退室メッセージをクライアントに送信する
    socket.on('ExitRoom', function (data) {
        if(typeof data !== 'string'){
            console.log("data is not string")
            return
        }
        socket.broadcast.emit('ReciveOtherEnter', data+'が退室しました');
    });
};
