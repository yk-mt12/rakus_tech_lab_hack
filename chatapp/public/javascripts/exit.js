'use strict';

// 退室メッセージをサーバに送信する
function exit() {
    // ユーザ名取得
    const userName = $('#userName').val();
    // 退室メッセージイベントを送信する
    socket.emit('ExitRoom',userName)

    // cookie削除
    deleteCookie('user_name');
    // 退室
    location.href = '/';
}

// サーバから受信した退室メッセージを画面上に表示する
socket.on('', function (data) {
    $('#thread').prepend('<p>' + '</p>');
});
