'use strict';

module.exports = function (server) {
    const socketIo = require('socket.io')(server, { wsEngine: 'ws' });
    const io = socketIo.listen(server);

    io.sockets.on('connection', function (socket) {
        // 投稿モジュールの呼出
        require('./publish')(socket, io);

        // 入室モジュールの呼出
        require('./enter')(socket);

        // 退室モジュールの呼出
        require('./exit')(socket);

        // 新規お題作成用モジュールの呼び出し
        require('./newTheme')(socket);

        // DBとの基本的な接続モジュールの呼び出し
        require('./db_operator')(socket)
    });
};
