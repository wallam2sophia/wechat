const Server = require('ws').Server;
const wss = new Server({ port: 9011 });
let SqliteDB = require('./db.js').SqliteDB;
let message = 'Message.db';
let MessageDB = new SqliteDB(message);
const clientsInfo = new Map();
wss.on('connection', function (ws, req) {
  let userid = req.url.split('/')[1];
  console.log(`用户${userid}已上线`);
  // 保存住当前用户连接
  clientsInfo.set(parseInt(userid), ws);

  ws.on('message', function (msg) {
    // 接收到消息保存到数据库
    console.log('收到一条消息', JSON.parse(msg));
    let { sender, receiver, message } = JSON.parse(msg);

    //添加一条消息记录
    let tileData = [[sender, receiver, message, 0]];
    let insertTileSql = 'insert into message(sender, receiver,message,status) values(?, ?, ?,?)';
    MessageDB.insertData(insertTileSql, tileData);
    let sendObj = {
      type: 'msg',
      data: JSON.parse(msg),
    };
    // 返回给发送方
    if (clientsInfo.has(sender)) {
      console.log(`向${sender}发送消息`);

      clientsInfo.get(sender).send(JSON.stringify(sendObj));
    }
    // 如果接收方在线发送该消息
    if (clientsInfo.has(receiver)) {
      console.log(`向${receiver}发送消息`);
      clientsInfo.get(receiver).send(JSON.stringify(sendObj));
    }
  });
});

module.exports = {
  clientsInfo,
};
