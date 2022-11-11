'use strict';

// チャットルームに入室する
function enter() {
    console.log("Enter")
    // 入力されたユーザ名を取得する
    const userName = $("#userName").val();
    // ユーザ名が未入力でないかチェックする
    console.log(userName)
    if (userName === ""){
        alert("名前を入力してください")
    }else{
        $('form').submit();
    }
}

function enterNewTheme() {
    console.log("enterNewTheme");
    $('create_theme_container').submit();
}

function post(path, params, method='post') {

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
  
        form.appendChild(hiddenField);
      }
    }
  
    document.body.appendChild(form);
    form.submit();
  }