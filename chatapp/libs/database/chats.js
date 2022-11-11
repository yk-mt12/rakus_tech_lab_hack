'use strict';

const path = require('path');
const sqlite3 = require("sqlite3");
const table = 'chats';

class Chat {
  constructor({
    chat_id = undefined,
    user_id = undefined,
    room_id = undefined,
    content = undefined,
    good = undefined,
    created_at = undefined,
    updated_at = undefined
  }) {
    this.chat_id = chat_id,
      this.user_id = user_id,
      this.room_id = room_id,
      this.content = content,
      this.good = good,
      this.created_at = created_at,
      this.updated_at = updated_at
  }

  static async createTable() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // chatsテーブル
        db.run("create table if not exists chats(chat_id integer primary key, user_id integer, room_id integer, content integer, good integer, created_at integer, updated_at integer)", (err) => {
          if (err) return reject(err)
          return resolve(true);
        });
      });
    });
      // db.close();
  }

  // チャットの作成
  async create() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];

    const date = new Date();
    const unixtime = Math.floor(date.getTime() / 1000);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // usersテーブル
        db.get("insert into chats(user_id, room_id, content, good, created_at, updated_at) values(?,?,?,?,?,?) returning chat_id", this.user_id, this.room_id, this.content, 0, unixtime, unixtime, (err, row) => {
          if (err) return reject(err);
          
          ret.push(new Chat({
            chat_id:row["chat_id"],
            user_id:this.user_id,
            room_id:this.room_id,
            content:this.content,
            created_at:unixtime,
            updated_at:unixtime
          }));

          if(ret.length > 0){
            return resolve(ret[0]);
          }
          return reject('Not found chat.');
        });
      });
    });
  }

  static async readByRoomId(id) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("select * from chats where room_id = ? order by chat_id desc", id, (err, rows) => {
          if (err) return reject(err)
          if (typeof rows === "undefined") return reject('Not found chat.');
          
          rows.forEach(row => {
            ret.push(new Chat({
              chat_id: row['chat_id'],
              user_id: row['user_id'],
              room_id: row['room_id'],
              content: row['content'],
              good: row['good'],
              created_at: row['created_at'],
              updated_at: row['updated_at'],
            }));
          });

          if (ret.length > 0) {
            return resolve(ret);
          }

          return reject('Not found chats.');
        });
      })
    });
  }
  
  static async readByRoomIdWithUser(id) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("select * from chats inner join users on chats.user_id = users.user_id  where room_id = ?", id, (err, rows) => {
          if (err) return reject(err)
          if (typeof rows === "undefined") return reject('Not found chat.');
          rows.forEach(row => {
            ret.push({
              chat_id: row['chat_id'],
              user_id: row['user_id'],
              room_id: row['room_id'],
              content: row['content'],
              user_name:row['user_name'],
              good: row['good'],
              created_at: row['created_at'],
              updated_at: row['updated_at'],
            });
          });

          if (ret.length > 0) {
            return resolve(ret);
          }

          return reject('Not found chats.');
        });
      })
    });
  }
  static async readByRoomId(id) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    let ret = [];
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("select * from chats where room_id = ? order by chat_id desc", id, (err, rows) => {
          if (err) return reject(err)
          if (typeof rows === "undefined") return reject('Not found chat.');
          
          rows.forEach(row => {
            ret.push(new Chat({
              chat_id: row['chat_id'],
              user_id: row['user_id'],
              room_id: row['room_id'],
              content: row['content'],
              good: row['good'],
              created_at: row['created_at'],
              updated_at: row['updated_at'],
            }));
          });

          if (ret.length > 0) {
            return resolve(ret);
          }

          return reject('Not found chats.');
        });
      })
    });
  }
  static async readAll() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("select * from chats inner join rooms on chats.room_id = rooms.room_id ORDER BY room_id ASC", (err, row) => {
          if(!row) return reject(err)
          if(row.length > 0){
            return resolve(row);
          }
          return reject('Not found room.');
        });
      })
    });
  }

  async update() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    const date = new Date();
    const unixtime = Math.floor(date.getTime() / 1000);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
      // usersテーブル
        db.run("update chats set content = ?,updated_at=? where chat_id == ?", this.content, unixtime, this.chat_id, (err)=> {
          if (err) return reject(err)
          return resolve(true);
        });
      });
    });
    // db.close();
  }
  
  async goodUpdate() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    const date = new Date();
    const unixtime = Math.floor(date.getTime() / 1000);
    db.serialize(() => {
      // usersテーブル
      db.run("update chats set good = ?,updated_at=? where chat_id == ?", this.good, unixtime, this.chat_id);
    });

    db.close();
  }

  delete() {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // usersテーブル
        db.run("delete from users where chat_id == ?", this.chat_id, (err) => {
          if (err) return reject(err)
          return resolve(true);
        });
      });
    // db.close();
    });
  }

  static async searchByUserId(user_id) {
    const db_path = path.join(__dirname, "../../app.db");
    const db = new sqlite3.Database(db_path);

    const ret = []
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all("select * from chats where user_id = ? order by chat_id desc", user_id, (err, items) => {
          if (err) return reject(err)

          if (items.length > 0) {
            return resolve(items)
          }

          return reject('Not found chats.');
        });
      })
    });
  }
}

module.exports = Chat;