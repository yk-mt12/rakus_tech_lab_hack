'use strict';

// 投稿メッセージをサーバに送信する
function publish() {
    // ユーザ名を取得
    // 現状では簡単になりすましが可能、第三者からの予測が困難なトークンなどに置き換えるのが望ましい？
    const user_name = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    const room_title = $('#room_title').text();
    const user_id = $('#userName').attr('name')
    const room_id = $('#room_title').attr('name')
    // メッセージ内容を検証
    if(message === ''){
        alert('投稿内容が空になっています。');
        return
    }

    // 投稿内容を送信
    //[ひとりごと]DBとの通信や他の場所での使い回しを考慮してModelにしたほうが良いかも
    const request = {
        userName: user_name,
        user_id:user_id,
        message: message,
        room_title:room_title,
        room_id:room_id
    };
    socket.emit('sendMessageEvent',request);

    // フォームをリセット
    $('#message').val('');

    return false;
}

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('receiveMessageEvent', function (data) {
    // ここにもバリデーションを入れるべき？
    const data_keys = Object.keys(data);
    if(!(data_keys.includes('chat_id') && data_keys.includes('message'))){
        console.error('The chat data is corrupted.');
        return;
    }
    
     //ルームidとチャットのルームidが違う場合、表示しない
    const room_id = $('#room_title').attr('name')
    if(data.room_id != room_id) return

    //今現在固有のidは適当に設定している
    // $('#new_silly').prepend(
    //     `<div id=${data.chat_id} class="one_silly  ml-4 mt-2"> <div class="silly_content_contener d-flex flex-row align-items-start"> <div class="message-icon rounded-circle bg-secondary text-white h3"> <i class="fas fa-user"></i> </div> <div class="p-0 ml-3" style="width: 70%;"> <div class="silly_user_name" style="color: darkcyan; font-size: 16px; text-align: left;">${data.user_name}</div> <p class="message-text float-left text-left p-2 mb-1 bg-light">${data.message}</p> </div> </div> <div class="evaluation_container mr-5 pr-3"> <div class="d-flex flex-row-reverse "> <div id="counter" class="mt-1 h5 ">0</div > <i id="heart" class="far fa-heart h5"></i> </div> </div><div class="border m-0" > </div> </div>`
    // );
    $('#new_silly').prepend(
        `<div id=${data.chat_id} class="one_silly  ml-4 mt-2"> <div class="silly_content_contener d-flex flex-row align-items-start"> <div class="message-icon rounded-circle bg-secondary text-white h3"> <i class="fas fa-user"></i> </div> <div class="p-0 ml-3" style="width: 70%;"> <div class="silly_user_name" style="color: darkcyan; font-size: 16px; text-align: left;"> <a href="user/${data.user_name}">${data.user_name}</a> </div> <p class="message-text float-left text-left p-2 mb-1 bg-light">${data.message}</p> </div> </div> <div class="evaluation_container mr-5 pr-3"> <div class="d-flex flex-row-reverse "> <div id="counter" class="mt-1 h5 ">0</div > <i id="heart" class="far fa-heart h5"></i> </div> </div><div class="border m-0" > </div> </div>`
    );

    //いいねのボタンにクリックイベントを仕込む
    $('#heart').click(function() {
        const silly_id = $(this).parent().parent().parent().attr('id')
        const good = Number($(`#${silly_id}`).find('div#counter').text()) + 1
        const msg = {
            chat_id:silly_id,
            good:good,
        }
        socket.emit('Good',msg)

    })
    
});

//すべてのルームを表示する処理
socket.on('ResultAllRoom',(data)=>{
    if(typeof data !== 'object'){
        console.log("data is no object")
        return
    }
    $('#search_list').empty()
    for(let i of data){
        $("#search_list").append(`<li id='rooms' data-id=${i.room_id}>${i.room_name}</li>`)
    }
    $('[id=rooms]').click(function(){
        socket.emit('EnterChatRoom',{"user_name":user_name,'room_title':$(this).text(),'room_id':$(this).data('id')})
        socket.emit('ReadRoomName')
        socket.emit('ReadRecommend')
    })
    
    $('#search_title').text('Rooms');

})

//検索したルーム名だけを表示する処理
socket.on('SearchResult',(data)=>{
    if(typeof data !== 'object'){
        console.log("data is no object")
        return
    }
    $('#search_list').empty()
    for(let i of data){
        $("#search_list").append(`<li id='rooms' data-id=${i.room_id}>${i.room_name}</li>`)
    }
    $("[id=rooms]").css('font-weight','bold')
    $('[id=rooms]').click(function(){
        socket.emit('EnterChatRoom',{"user_name":user_name,'room_title':$(this).text(),'room_id':$(this).data('id')})
        socket.emit('ReadRoomName')
        socket.emit('ReadRecommend')
    })
    
    $('#search_title').text('Search Result:'+Object.keys(data).length+'件');

})
//レコメンド処理
socket.on('ReturnRecommend',(data)=>{
    if(typeof data !== 'object'){
        console.log("data is no object")
        return
    }
    //コメントの多い順に並べ替え
    const sort_data = data.sort((a,b)=>{
        return   b.comment - a.comment
    })
    $('#recommend_list').empty()
    let show_limit = 3
    for(let i of sort_data){
        if(i.comment > 3 && show_limit > 0){
            $("#recommend_list").append(`<li id='rooms' data-id=${i.room_id}>${i.room_name}</li>`)
            show_limit = show_limit - 1
        }
    }
    $('[id=rooms]').click(function(){
        socket.emit('EnterChatRoom',{"user_name":user_name,'room_title':$(this).text(),'room_id':$(this).data('id')})
        socket.emit('ReadRoomName')
        socket.emit('ReadRecommend')
    })
    
    $('#search_title').text('Rooms');
})

//いいねをしたときのフロントの変更処理
socket.on('Good',(data)=>{
    const good_tmp = Number($(`#${data}`).find('div#counter').text()) + 1
    $(`#${data}`).find('div#counter').text(good_tmp)

})


//検索をしたときの処理
function searchRoom(){
    const search_val = $("#search").val();
    socket.emit('SearchRoom',search_val)
}

//検索欄が空白になった時の処理
$(document).on("keyup", "#search", function (e) {
    const input = $(this).val();
    if(input == "") socket.emit('ReadAllRoom')
    
});


  