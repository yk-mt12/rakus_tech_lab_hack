'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    // メッセージ内容を検証
    if(message === ''){
        alert('投稿内容が空です。')
        return
    };
    const request = {
        userName: userName,
        message: message,
        isDraft: true
    }
    socket.emit('sendMessageEvent', request);

    // フォームをリセットする
    $('#message').val('')

    return false;
}

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('receiveMessageEvent', function (data) {
    const data_keys = Object.keys(data);
    if(!(data_keys.includes('userName') && data_keys.includes('message') && data_keys.includes('isDraft'))){
        console.error('The chat data is corrupted.');
        return;
    }
    // メモならば
    if(data.isDraft){
        $('#thread').prepend('<p>' + data.userName + 'さん：' + data.message + '</p>');
    }
});