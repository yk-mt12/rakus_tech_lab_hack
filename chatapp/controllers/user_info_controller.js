'use strict';

const path = require('path');
const user = require(path.join(__dirname, "../libs/database/users"));
const room = require(path.join(__dirname, "../libs/database/rooms"));
const chat = require(path.join(__dirname, "../libs/database/chats"));

function getUserModel(user_name) {
    let ret = {};
    return new Promise((resolve) => {
        user.readByUserName(user_name).then((val) => {
            ret.user_model = val;
            return resolve(ret);
        }).catch((err) => {
            ret.user_model = null;
            return resolve(ret);
        });
    });
};

function getRoomModel(value) {
    let ret = value;
    return new Promise((resolve) => {
        room.searchByUserId(ret.user_model.user_id).then((val) => {
            ret.room_model = val;
            val.forEach((element,index) => {
                const datetime = new Date(element.created_at * 1000);
                ret.room_model[index].datetime = datetime.toLocaleDateString();
                chat.readByRoomId(element.room_id).then((val) => {
                    ret.room_model[index].chat_num = val.length;
                }).catch((err) => {
                    ret.room_model[index].chat_num = 0;
                });
            });
            return resolve(ret);
        }).catch((err) => {
            ret.room_model = [];
            return resolve(ret);
        });
    });
};

function getChatModel(value) {
    let ret = value;
    return new Promise((resolve) => {
        chat.searchByUserId(value.user_model.user_id).then((val) => {
            ret.chat_model = val;
            val.forEach((element,index) => {
                const datetime = new Date(element.created_at * 1000);
                ret.chat_model[index].datetime = datetime.toLocaleDateString();
            });
            return resolve(ret);
        }).catch((err) => {
            ret.chat_model = [];
            return resolve(ret);
        });
    });
};

module.exports.getUserInfo = async function(user_name) {
    return new Promise((resolve, reject) => {
        getUserModel(user_name).then(getRoomModel).then(getChatModel).then((val) => {
            return resolve(val);
        }).catch((err) => {
            return reject(err);
        });
    });
}