'use strict';

const Chat = require('../libs/database/chats');
const Room = require('../libs/database/rooms');
module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        //データが空ではないかチェック
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
        if(!(data_keys.includes('room_id') && data_keys.includes('message') && data_keys.includes('user_id'))){
            console.error('The chat data is corrupted.');
            return;
        }

        //DBにメッセージを保存
        const db_chat = new Chat({user_id:data.user_id,room_id:data.room_id,content:data.message,good:0})
        db_chat.create().then(V=>{
            let request= {
                chat_id:V.chat_id,
                user_name:data.userName,
                room_title:data.room_title,
                room_id:data.room_id,
                message:data.message,
                // isDraft:data.isDraft
            }
            console.log('new chat insert'+Object.values(V))
            io.sockets.emit('receiveMessageEvent',request);
        }).catch(e=>{
            console.log('error happened'+e)
        }) 
       
    });

    //いいねボタンを押したときのデータの受け取り
    socket.on('Good',function(data){
        if(typeof data !== 'object'){
            console.error("The chat data is not object.")
            return;
        }

        const data_keys = Object.keys(data)
        if(!(data_keys.includes('chat_id') && data_keys.includes('good'))){
            console.error('The chat data is corrupted.');
            return;
        }
        //メッセージのいいね数変更をDBに反映
        const chat_db = new Chat({chat_id:data.chat_id,good:data.good})
        try{
            chat_db.goodUpdate()
            console.log('data up date')
            socket.emit('Good',data.chat_id)
            socket.broadcast.emit('Good',data.chat_id)
        }catch(e){
            console.log(e)
        }
    })

    //検索で一致したルームを返す
    socket.on('SearchRoom',(data)=>{
        if(typeof data !=="string"){
            console.error('search data is not string')
        }
        if(!data){
            console.error('search data is not found')
            return
        }
        Room.searchByRoomName("%"+data+"%").then(v=>{
            socket.emit('SearchResult',v)
        }).catch(e=>{
            console.log(e)
        })
    })

    //全てのルームを返す
    socket.on('ReadAllRoom',()=>{
        Room.readAll().then(v=>{
            socket.emit('ResultAllRoom',v)
        }).catch(e=>{
            console.log(e)
        })
    })

};



