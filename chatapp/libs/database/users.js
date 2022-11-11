'use strict';

// const { registerMutator } = require('core/extensions');
const path = require('path');
const sqlite3 = require("sqlite3");
const table = 'users';

class User {
  //[memo]user_idは任意引数にするべき？
  constructor({user_id = undefined, user_name = undefined, created_at = undefined, updated_at = undefined}) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  //テーブルの初期化用関数
  static async createTable() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("create table if not exists users(user_id integer primary key, user_name text, created_at integer, updated_at integer)", (err) => {
          if (err) return reject(err)
          return resolve(true);
        });
      });
    });
  }

  //ユーザーの作成
  async create() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];
  
    const date = new Date();
    const unixtime = Math.floor(date.getTime() / 1000);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // usersテーブル
        db.get("insert into users(user_name,created_at,updated_at) values(?,?,?) returning user_id", this.user_name, unixtime,unixtime ,(err, row) => {
          if (err) return reject(err)
          ret.push(new User({
            user_id:row['user_id'],
            user_name:this.user_name,
            created_at:unixtime,
            updated_at:unixtime
          }));

          if(ret.length > 0){
            return resolve(ret[0]);
          }
        
          return reject('Not found user.');
        });
      });
    });
  }

  //ユーザーの読み取り
  static async readById(id) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get("select * from users where user_id = ?", id, (err, row) => {
          if (err) return reject(err);
          if (typeof row === "undefined") return reject('Not found user.');

          ret.push(new User({
            user_id:row['user_id'],
            user_name:row['user_name'],
            created_at:row['created_at'],
            updated_at:row['updated_at']
          }));

          if(ret.length > 0) return resolve(ret[0]);
          return reject('Not found user.');
        });
      })
    });
  }

  static async readByUserName(name) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get("select * from users where user_name = ?", name, (err, row) => {
          if (err) return reject(err);
          if (typeof row === "undefined") return reject('Not found user.');

          ret.push(new User({
            user_id:row['user_id'],
            user_name:row['user_name'],
            created_at:row['created_at'],
            updated_at:row['updated_at']
          }));

          if(ret.length > 0) return resolve(ret[0]);
          return reject('Not found user.');
        });
      })
    });
  }
  static async readByName(userName) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get("select * from users where user_name = ?", userName, (err, row) => {
          if (err) return reject(err)
          if (typeof row === "undefined") return reject('Not found user.');
          ret.push(new User({
            user_id:row['user_id'],
            user_name:row['user_name'],
            created_at:row['created_at'],
            updated_at:row['updated_at']
          }));

          if(ret.length > 0){
            return resolve(ret[0]);
          }
        
          return reject('Not found user.');
        });
      })
    });
  }


  //ユーザー情報の更新
  async update() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);
  
    const date = new Date();
    const unixtime = Math.floor(date.getTime() / 1000);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // usersテーブル
        db.run("update users set user_name = ?,updated_at=? where user_id = ?", this.user_name, unixtime,this.user_id, (err) => {
          if (err) return reject(err)
          return resolve(true);
        });
      });
    });
  }

  //ユーザーの削除
  async delete() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // usersテーブル
        db.run("delete from users where user_id = ?", this.user_id, (err) => {
          if (err) return reject(err)
          return resolve(true);
        });
      });
    });
  }
}

module.exports = User;
