let SqliteDB = require('./db.js').SqliteDB;
let user = 'User.db';
let UserDB = new SqliteDB(user);
let apply = 'Apply.db';
let ApplyDB = new SqliteDB(apply);
let message = 'Message.db';
let MessageDB = new SqliteDB(message);

let sql = `select * from apply where approver = 2 and status= 0`;
ApplyDB.queryData(sql).then((users) => {
  console.log(users);
});
