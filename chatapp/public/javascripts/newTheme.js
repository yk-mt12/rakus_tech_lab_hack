'use strict';

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
const param = location.search;
console.log("param", param);
const user_id = getParam('user_id');
// ユーザのnameを取得
socket.emit("getUserName", user_id);


// ヘッダーのユーザを適用
socket.on('reciveGetUserName', function (data) {
    console.log("recived user_name", data)
    if(data===""){
        alert("無効なユーザです");
    }else{
        $("#userName").attr("name", user_id);
        $("#userName").val(data);
        $(".header_user_name").text(data);
        $("#creater_user").text(data);
        $(".header_user_name").attr("href", "/user/"+data)
    }
});

function postTheme(){
    const theme = $('#input_theme').val();
    
    if(theme === ''){
        alert('投稿内容が空になっています。');
        return
    }
    // 投稿
    const request = {
        user_id : user_id,
        theme : theme
    }
    // 送信
    socket.emit('sendTheme', request);

    
    console.log("req ", request);
    return
}
let new_theme_result = ""
socket.on('receiveTheme', data => {
    console.log("recived Theme event ", data)
    new_theme_result = data
    if(data===""){
        // alert("お題の作成に失敗しました");
        $("#new_theme_result_title").text("お題の作成に失敗しました")
        $("#new_theme_result_msg").text("再びお題を作成しますか？")
    }else{
        $("#new_theme_result_title").text("お題の作成に成功しました")
        $("#new_theme_result_msg").text("更に新たなお題を作成しますか？")
        // フォーム初期化
        $('#input_theme').val("");
    }
    $("#new_theme_result").modal()
});

function modalYes(){

}

function modalNo(){
    const userName = $("#userName").val();
    console.log("modal no", userName)  
    post("/room", { userName: userName });
}
