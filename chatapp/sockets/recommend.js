const Room = require("../libs/database/rooms");
const Chat = require('../libs/database/chats');

module.exports = function(data){
    rooms = []
    Room.readAll().then(v=>{
        let room_count = Object.keys(v).length
        for(let i of v){
            
            Chat.readByRoomId(i.room_id).then(v=>{
                rooms.push({room_data:i,comments:Object.keys(v).length})
            })
            room_count = room_count - 1
            if(room_count == 0) socket.emit('ResultAllRoom',rooms)
        }
        
    }).catch(e=>{
        socket.emit('ResultAllRoom',rooms)
        console.log(e)
    })
}