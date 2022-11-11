'use strict';

const Room = require("../libs/database/rooms");
const Chat = require('../libs/database/chats');

module.exports = function (socket) {
    //今あるルームを全て取り出して返す。
    socket.on('ReadRoomName',()=>{
        Room.readAll().then(v=>{
            socket.emit('ResultAllRoom',v)
        }).catch(e=>{
            //もし無ければ空の配列を返す
            console.log(e)
            socket.emit('ResultAllRoom',[])
        })
    })

    socket.on('ReadRecommend',()=>{
        Chat.readAll().then(v=>{
            let rooms_comment = [{"room_id":v[0].room_id,"room_name":v[0].room_name,"comment":1}]
            let index = 0
            for(let i=1;i<v.length;i++){
                if(rooms_comment[index].room_id != v[i].room_id){
                    index = index + 1
                    rooms_comment[index] = {"room_id":v[i].room_id,"room_name":v[i].room_name,"comment":1}
                }else if(rooms_comment[index].room_id == v[i].room_id){
                    rooms_comment[index].comment = rooms_comment[index].comment + 1
                }
            }
            socket.emit('ReturnRecommend',rooms_comment)
        }).catch(e=>{
            //ルームがないときの処理
            console.log(e)
        })
    })

    //チャットルームに入る処理
    socket.on('EnterChatRoom',function(data){
        //データ型のvalidation
        if(typeof data !== 'object'){
            console.error('data is not object')
            return
        }
        //必要なデータがあるかのvalidation
        const data_keys = Object.keys(data)
        if(!(data_keys.includes('user_name') && data_keys.includes('room_title') && data_keys.includes('room_id'))){
            console.error('The data is corrupted.')
            return
        }

        //入出するルームのトークをDBから取得
        Chat.readByRoomIdWithUser(data.room_id).then(v=>{
            console.log(v)
            const msg = {
                user_name:data.user_name,
                room_title:data.room_title,
                room_message:v,
                room_id:data.room_id
            } 
            socket.emit('ReceiveChatEnter',msg)
        }).catch(e=>{
            console.log(e)
            const msg = {
                user_name:data.user_name,
                room_title:data.room_title,
                room_message:[],
                room_id:data.room_id
            } 
            socket.emit('ReceiveChatEnter',msg)
        })
    }) 
};
