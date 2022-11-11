'use strict';

// 入室メッセージをサーバに送信する
// 入力されたユーザ名を取得する
const user_name = $('#userName').val();
// 入室メッセージイベントを送信する
socket.emit('EnterHome',user_name)

// ユーザIDの取得
socket.emit("getUserID", user_name)

//全てのルーム名を取得
socket.emit('ReadRoomName')

//レコメンドの受け取得
socket.emit('ReadRecommend')


// ユーザID取得完了時
socket.on('reciveGetUserID', function (user_id) {
    console.log("recived user_data", user_id)
    $("#userName").attr("name", user_id)
    $(".create_theme").attr("href", "/new/theme?user_id="+user_id)
});

//ホーム画面を表示する処理
$(document).ready(function(){
    //処理
    displayPage('#home_page')
    if($('#recommend_list li').length != 0) $('#recommend_list').empty()
    $('#search_title').text('Rooms')
});

//チャット画面に入った時の処理
socket.on('ReceiveChatEnter',function(data){
    if(!data) return 
     //画面をチャット画面に変更する
    clearPage()
    displayPage('#chat')
    //以前の画面の内容を初期化する
    if($('#thread p').length !=0) $('#thread').empty()
    if($('#new_silly .one_silly').length != 0) $('#new_silly .one_silly').remove() 
    if($('#popular_silly div').length != 0) $('#popular_silly').empty()

    //メインとサイドのタイトル表示
    $('#room_title').text(data.room_title)
    $('#search_title').text('Rooms')
    //ルームタイトルにnameタグでid挿入
    $("#room_title").attr("name", data.room_id)
    
    //メッセージを投稿されたメッセージを順に変更
    const sort_msg = data.room_message.sort((a,b)=>{
        return a.create_at - b.create_at   
    });
    
    //ルームのメッセージを表示する処理
    for(let j of sort_msg){
        //人気のボケを左側に表示する処理
        if(j.good >= 5) $('#popular_silly').prepend(`<div name = ${j.good} class="one_silly d-flex flex-row align-items-start ml-4"><div class="message-icon rounded-circle bg-secondary text-white h3"><i class="fas fa-user"></i></div><div><div class="silly_user_name p-0 ml-3" style="color: darkcyan; font-size: 16px; text-align: left;"><a href="user/${j.user_name}">${j.user_name}</a></div><p class="message-text float-left text-left p-2 ml-2 mb-0 bg-light">${j.content}</p></div>`)
        //通常のボケを表示
        $('#new_silly').prepend(
            `<div id=${j.chat_id} class="one_silly  ml-4 mt-2"> <div class="silly_content_contener d-flex flex-row align-items-start"> <div class="message-icon rounded-circle bg-secondary text-white h3"> <i class="fas fa-user"></i> </div> <div class="p-0 ml-3" style="width: 70%;"> <div class="silly_user_name" style="color: darkcyan; font-size: 16px; text-align: left;"><a href="user/${j.user_name}">${j.user_name}</a></div> <p class="message-text float-left text-left p-2 mb-1 bg-light"> ${j.content}  </p> </div> </div> <div class="evaluation_container mr-5 pr-3"> <div class="d-flex flex-row-reverse "> <div id="counter" class="mt-1 h5 ">${j.good}</div > <i id="heart" class="far fa-heart h5"></i> </div> </div><div class="border m-0" > </div> </div>`
            );

        // いいねをした時の処理
        $('#heart').click(function() {
            const silly_id = $(this).parent().parent().parent().attr('id')
            const good = Number($(`#${silly_id}`).find('div#counter').text()) + 1
            const request = {
                chat_id:silly_id,
                good:good,
            }
            socket.emit('Good',request)
        })
    }
    //人気のコメントの並び替え
    $('#popular_silly').html(
        $('#popular_silly > div').sort(function(a,b){
            var x = Number($(a).attr("name"));
            var y = Number($(b).attr("name"));
            // 降順に並べ替える
            return y - x;
        })   
    )
})

//画面を表示する処理
function displayPage(page){
    $(page).css("display", "block");
    $(page).fadeIn(2000, "linear"); 
}
//画面を消す処理
function clearPage(){
    $(".main_content").css("display", "none");
}

