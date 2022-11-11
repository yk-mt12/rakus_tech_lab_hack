// モジュールのロード
const express = require('express');
const router = express.Router();

/**
 * ルーティングの設定
 */

// ルートパス「/」にアクセスした場合の処理
router.get('/', function(request, response) {
    // views/index.hbs を表示する
    response.render('index');
});

// 「/rakus」にアクセスした場合の処理
router.get('/rakus', function(request, response) {
    // views/rakus.hbs を表示する
    // 第2引数で views/rakus.hbs の {{title}}, {{message}} に表示する文字をセットしている
    response.render('rakus', {title:"こんにちは",message:"Rakus"});
});

// ルーティングオブジェクトを外部ファイルへエクスポートする
module.exports = router;
