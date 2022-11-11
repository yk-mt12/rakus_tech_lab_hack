'use strict';

const path = require('path');
const express = require('express');
const router = express.Router();

// ログイン画面の表示
router.get('/', function(request, response, next) {
    response.render('index');
});

// チャット画面の表示
router.post('/room', function(request, response, next) {
    console.log('ユーザ名：' + request.body.userName);
    response.setHeader('Set-Cookie',`user_name=${encodeURIComponent(request.body.userName)}; path=/; max-age=1800`);
    // response.render('room', { userName: request.body.userName });
    response.redirect(request.baseUrl + '/room');
});

router.get('/room', function(request, response, next) {
    const user_name = request.cookies.user_name;
    if(typeof user_name === 'undefined'){
        response.redirect(request.baseUrl + '/');
    }else{
        response.render('room', { userName: decodeURIComponent(user_name) });
    }
});

// ユーザープロフィールの表示
router.get('/user/:userName', function(request, response, next) {
    const user_name = request.cookies.user_name;
    if(typeof user_name === 'undefined'){
        response.redirect(request.baseUrl + '/');
    }else{
        const user_info_controller = require(path.join(__dirname, "../controllers/user_info_controller"));
        user_info_controller.getUserInfo(request.params.userName).then((val) => {
            response.render('userProfile_simple', {
                myName: decodeURIComponent(request.cookies.user_name),
                userName: val.user_model.user_name,
                userRooms: val.room_model,
                userChats: val.chat_model
        });
    });
    }
});

//　大喜利投稿画面の表示
router.get('/new/theme', function(request, response, next) {
    console.log('reqest of /new/theme' + request);
    response.render('newTheme', { userName: request.body.userName });
});

module.exports = router;
