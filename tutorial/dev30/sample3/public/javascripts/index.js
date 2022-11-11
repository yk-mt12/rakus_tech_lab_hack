// socket.ioの処理開始
const socket = io.connect();

// 自クライアントの接続イベント（enterMyselfEvent）を受信する
socket.on('enterMyselfEvent', function (data) {
    // 画面上にメッセージを表示
    $('#thread').prepend('<p>' + data + '</p>');
});

// 自クライアント以外の接続イベント（enterOtherEvent）を受信する
socket.on('enterOtherEvent', function (data) {
    // 画面上にメッセージを表示
    $('#thread').prepend('<p>' + data + '</p>');
});

// メッセージを入力する
function sendMessage() {
    const message = prompt('メッセージを入力してください。\n' +
                    'このメッセージはすべてのクライアントに送信されます。');

    // メッセージ入力イベント（sendMessageEvent）を送信する

}

// メッセージ表示イベント（receiveMessageEvent）を受信する
socket.on('', function (data) {
    // 画面上にメッセージを表示
    $('#thread').prepend('<p>' + '</p>');
});
