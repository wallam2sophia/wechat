let SqliteDB = require('./db.js').SqliteDB;
let user = 'User.db';
let UserDB = new SqliteDB(user);
let apply = 'Apply.db';
let ApplyDB = new SqliteDB(apply);
let message = 'Message.db';
let MessageDB = new SqliteDB(message);
let dbMap = {
    'user': UserDB,
    'apply': ApplyDB,
    'message': MessageDB
}

for (let item of ['user', 'apply', 'message']) {
    let sql1 = `delete from ${item}` //清空数据
    dbMap[item].executeSql(sql1);
}

