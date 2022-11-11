/**
 * Socket.IOの処理
 */

 module.exports = function (server) {

    const socketIo = require('socket.io')(server, { wsEngine: 'ws' });
    const io = socketIo.listen(server);

    // 接続
    io.sockets.on('connection', function (socket) {
        // 自クライアントに接続イベント（enteringMyselfEvent）を送信する
        socket.emit('enterMyselfEvent', 'あなたが接続しました。');

        // 自クライアント以外に接続イベント（enterOtherEvent）を送信する
        socket.broadcast.emit('enterOtherEvent', '他のクライアントが接続しました。');

        // メッセージ入力イベント（sendMessageEvent）を受信する
        socket.on('', function (data) {
            if (!data) {
                return;
            }

            console.log('クライアントの入力値：' + data);

            // 全クライアントが受信するメッセージ表示イベント（receiveMessageEvent）を送信する

        });
    });
};
