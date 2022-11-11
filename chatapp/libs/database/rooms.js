'use strict';

const { resolve } = require('path');
const path = require('path');
const sqlite3 = require("sqlite3");
const table = 'rooms';

class Room {
  constructor({room_id = undefined, room_name = undefined, user_id = undefined, created_at = undefined, updated_at = undefined}) {
    this.room_id = room_id;
    this.room_name = room_name;
    this.user_id = user_id
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async createTable() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);
    return new Promise((resolve, reject) => {
      db.serialize(() => {
      // roomsテーブル
        db.run("create table if not exists rooms(room_id integer primary key, room_name text, user_id integer, created_at integer, updated_at integer)", (err) => {
          if (err) return reject(err)
          return resolve(true);
        });
      });
    });
  }

  //ルームの作成
  async create() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];

    const date = new Date();
    const unixtime = Math.floor(date.getTime() / 1000);
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // roomsテーブル
        db.get("insert into rooms(room_name, user_id, created_at,updated_at) values(?,?,?,?) returning room_id", this.room_name, this.user_id, unixtime,unixtime, (err, row) => {
          if (err) return reject(err)
          ret.push(new Room({
            room_id:row['room_id'],
            room_name:this.room_name,
            user_id:this.user_id,
            good:0,
            created_at:unixtime,
            updated_at:unixtime
          }));
          if(ret.length > 0){
            return resolve(ret[0]);
          }
          return reject('Not found room.');
        });
      });
    });
  }

  //ルームの読み取り
  static async readByRoomId(id) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get("select * from rooms where room_id = ?", id, (err, row) => {
          if (err) return reject(err)
          if (typeof row === "undefined") return reject('Not found room.');
          ret.push(new Room({
            room_id:row['room_id'],
            room_name:row['room_name'],
            user_id:row['user_id'],
            created_at:row['created_at'],
            updated_at:row['updated_at']
          }));

          if (ret.length > 0) {
            return resolve(ret[0]);
          }
          return reject('Not found room.');
        });
      })
    });
  }
  
  static async readAll() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("select * from rooms", (err, row) => {
          if(row.length > 0){
            return resolve(row);
          }
          return reject('Not found room.');
        });
      })
    });
  }
  // static async readAlltest() {
  //   const db_path = path.join(__dirname, "../../app.db");
  //   const db = new sqlite3.Database(db_path);

  //   return new Promise((resolve, reject) => {
  //     db.serialize(() => {
  //       db.all("select * from rooms", (err, row) => {
  //         if(row.length > 0){
  //           return resolve(row);
  //         }
  //         return reject('Not found room.');
  //       });
  //     })
  //   });
  // }

  //ルーム情報の更新
  async update() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    const date = new Date();
    const unixtime = Math.floor(date.getTime() / 1000);

    return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("update rooms set room_name = ?,updated_at=? where room_id = ?", this.room_name, unixtime,this.room_id, (err)=> {
        if (err) return reject(err)
        return resolve(true);
      });
    });
  });
  }

  //ルームの削除
  async delete() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("delete from rooms where room_id = ?", this.room_id, (err) => {
          if (err) return reject(err)
          return resolve(true);
        });
      });
    });
  }

  static async searchByRoomName(search_word) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    const ret = []
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("select * from rooms where room_name like ? order by room_id desc", search_word, (err, items) => {
          if (err) return reject(err)

          if (items.length > 0) {
            return resolve(items)
          }

          return reject('Not found rooms.');
        });
      })
    });
  }

  static async searchByUserId(user_id) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    const ret = []
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("select * from rooms where user_id = ? order by room_id desc", user_id, (err, items) => {
          if (err) return reject(err)

          if (items.length > 0) {
            return resolve(items)
          }

          return reject('Not found rooms.');
        });
      })
    });
  }
}

module.exports = Room;