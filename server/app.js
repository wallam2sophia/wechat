const app = require('express')();
const bodyParser = require('body-parser');
app.listen(9010, () => {
  console.log('server listening on 9010');
});
const { clientsInfo } = require('./ws.js');

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json ：接受 json 或者可以转换为json的数据格式
app.use(bodyParser.json());

let SqliteDB = require('./db.js').SqliteDB;
let user = 'User.db';
let UserDB = new SqliteDB(user);
let group = 'Group.db';
let GroupDB = new SqliteDB(group);
let apply = 'Apply.db';
let ApplyDB = new SqliteDB(apply);
let message = 'Message.db';
let MessageDB = new SqliteDB(message);
/// 添加用户表
let createUserTableSql = 'create table if not exists user(id INTEGER PRIMARY KEY, username CHAR, password CHAR, telphone CHAR, avatar BLOB, unread INTEGER,online BOOLEAN,friends TEXT,groups TEXT);';
UserDB.createTable(createUserTableSql);
/// 添加群聊表
let createGroupTableSql = 'create table if not exists group(id INTEGER PRIMARY KEY, name CHAR, members TEXt, unread INTEGER);';
GroupDB.createTable(createGroupTableSql);
/// 添加申请表
let createApplyTableSql = 'create table if not exists apply(id INTEGER PRIMARY KEY, applier INTEGER, approver INTEGER, type CHAR,status CHAR);';
ApplyDB.createTable(createApplyTableSql);
/// 添加信息表
let createMsgTableSql = 'create table if not exists message(id INTEGER PRIMARY KEY, sender INTEGER, receiver INTEGER, message TEXT,status CHAR,createTime TIME);';
MessageDB.createTable(createMsgTableSql);
//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
// 查询所有用户
app.get('/api/all/user', (req, res) => {
  let sql = `select * from user`;
  UserDB.queryData(sql).then((users) => {
    // 用户存在
    res.status(200);
    res.send(users);
  });
});
// 查询登录用户信息
app.post('/api/user', (req, res) => {
  let id = req.body.id;
  let sql = `select * from user where id = '${id}'`;
  UserDB.queryData(sql).then((users) => {
    if (users.length > 0) {
      // 用户存在
      res.status(200);
      res.send(users[0]);
    } else {
      //用户不存在
      res.status(404);
      let obj = {
        msg: '用户不存在',
      };
      res.send(obj);
    }
  });
});
// 注册
app.post('/api/register', (req, res) => {
  let form = req.body;
  let sql = `select * from user where username = '${form.username}'`;
  UserDB.queryData(sql).then((users) => {
    if (users.length > 0) {
      // 用户已存在
      res.status(500);
      let obj = {
        msg: '用户已存在，直接登陆即可',
      };
      res.send(obj);
    } else {
      /// 新增用户
      let tileData = [[form.username, form.password, 1]];
      let insertTileSql = 'insert into user(username, password,online) values(?, ?, ?)';
      UserDB.insertData(insertTileSql, tileData);

      let sql = `select * from user where username = '${form.username}' and password = '${form.password}'`;
      UserDB.queryData(sql).then((users) => {
        // 向所有用户广播有新用户增加
        let msg = {
          type: 'user',
        };
        [...clientsInfo.values()].forEach((ws) => {
          ws.send(JSON.stringify(msg));
        });
        //   返回用户信息
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200);
        res.send(users[0]);
      });
    }
  });
});
// 登录
app.post('/api/login', (req, res) => {
  let form = req.body;
  let sql = `select * from user where username = '${form.username}' and password = '${form.password}'`;
  UserDB.queryData(sql).then((users) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    if (users.length > 0) {
      // 更新用户在线信息
      let updateSql = `update user set online = 1 where  username = '${form.username}' and password = '${form.password}'`;
      UserDB.executeSql(updateSql);
      //   返回用户信息
      res.status(200);
      res.send(users[0]);
    } else {
      //用户名或密码错误
      res.status(500);
      let obj = {
        msg: '用户名或密码错误',
      };
      res.send(obj);
    }
  });
});

// 添加朋友
app.post('/api/friend/apply', (req, res) => {
  let { userId, friendName } = req.body;
  let sql = `select * from user where username = '${friendName}'`;
  UserDB.queryData(sql).then((users) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    if (users.length > 0) {
      // 检查是否已经发送申请且状态不为-1
      let sql = `select * from apply where (applier = '${userId}' and approver='${users[0].id}' and (status = 0 OR status = 1)) OR (applier = '${users[0].id}' and approver='${userId}' and (status = 0 OR status = 1))`;
      ApplyDB.queryData(sql).then((rows) => {
        if (rows.length > 0) {
          //已存在该申请
          res.status(500);
          let obj = {
            msg: '该申请已存在',
          };
          res.send(obj);
        } else {
          // 添加一条申请信息
          let tileData = [[userId, users[0].id, 1, 0]];
          let insertTileSql = 'insert into apply(applier, approver,type,status) values(?, ?, ?,?)';
          ApplyDB.insertData(insertTileSql, tileData);
          // 服务器主动推送消息到客户端表示有新的申请
          if (clientsInfo.has(users[0].id)) {
            console.log(`向${users[0].username}推送申请信息`);
            let msg = {
              type: 'apply',
            };
            clientsInfo.get(users[0].id).send(JSON.stringify(msg));
          }
          //   返回用户信息
          res.status(200);
          res.send({ msg: '已提交申请，待通过!' });
        }
      });
    } else {
      //没有该用户
      res.status(500);
      let obj = {
        msg: '该用户不存在',
      };
      res.send(obj);
    }
  });
});
// 获取审批信息
app.post('/api/sys/audit', (req, res) => {
  let { userId } = req.body;
  let sql = `select * from apply where approver = '${userId}' and status= 0`;
  ApplyDB.queryData(sql).then((users) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    if (users.length > 0) {
      //   返回申请信息
      res.status(200);
      res.send(users);
    } else {
      //没有申请信息
      res.send([]);
    }
  });
});
// 通过申请
app.post('/api/friend/approve', (req, res) => {
  let { userId, friendId, applyId, status } = req.body;
  let sql = `select * from apply where id = '${applyId}' and status = 0`;
  ApplyDB.queryData(sql).then((rows) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    if (rows.length > 0) {
      // 更新申请状态
      let updateSql = `update apply set status = '${status}' where  id = '${applyId}'`;
      UserDB.executeSql(updateSql);
      // 更新用户朋友信息
      if (status == 1) {
        // 通过
        let q1 = `select * from user where id = '${userId}'`;
        UserDB.queryData(q1).then((rows) => {
          let newF = JSON.stringify([...(JSON.parse(rows[0].friends) || []), friendId]);
          let updateSql1 = `update user set friends = '${newF}' where  id = '${userId}'`;
          UserDB.executeSql(updateSql1);
          // 服务器主动推送消息到客户端表示有新的审批
          if (clientsInfo.has(rows[0].id)) {
            console.log(`向${rows[0].username}推送审批通过信息`);
            let msg = {
              type: 'approve',
            };
            clientsInfo.get(rows[0].id).send(JSON.stringify(msg));
          }
        });
        let q2 = `select * from user where id = '${friendId}'`;
        UserDB.queryData(q2).then((rows) => {
          let newF = JSON.stringify([...new Set([...(JSON.parse(rows[0].friends) || []), userId])]);
          let updateSql1 = `update user set friends = '${newF}' where  id = '${friendId}'`;
          UserDB.executeSql(updateSql1);
          // 服务器主动推送消息到客户端表示有新的审批
          if (clientsInfo.has(rows[0].id)) {
            console.log(`向${rows[0].username}推送审批通过信息`);
            let msg = {
              type: 'approve',
            };
            clientsInfo.get(rows[0].id).send(JSON.stringify(msg));
          }
        });

        //添加一条消息记录
        let tileData = [[userId, friendId, '已添加好友成功', 0]];
        let insertTileSql = 'insert into message(sender, receiver,message,status) values(?, ?, ?,?)';
        MessageDB.insertData(insertTileSql, tileData);
        //   返回用户信息
        res.status(200);
        res.send({ msg: '成功添加朋友!' });
      } else {
        // 拒绝
        let q1 = `select * from user where id = '${friendId}'`;
        UserDB.queryData(q1).then((rows) => {
          // 服务器主动推送消息到申请者
          if (clientsInfo.has(rows[0].id)) {
            console.log(`向${rows[0].username}推送审批拒绝信息`);
            let msg = {
              type: 'reject',
              data: userId,
            };
            clientsInfo.get(rows[0].id).send(JSON.stringify(msg));
          }
        });
        let q2 = `select * from user where id = '${userId}'`;
        UserDB.queryData(q2).then((rows) => {
          // 服务器主动推送消息到客户端表示有新的审批
          if (clientsInfo.has(rows[0].id)) {
            console.log(`向${rows[0].username}推送审批处理信息`);
            let msg = {
              type: 'approve',
            };
            clientsInfo.get(rows[0].id).send(JSON.stringify(msg));
          }
        });
        //   返回用户信息
        res.status(200);
        res.send({ msg: '处理成功!' });
      }
    } else {
      //没有该用户
      res.status(404);
      let obj = {
        msg: '该申请不存在或已经被处理',
      };
      res.send(obj);
    }
  });
});
// 获取历史消息
app.post('/api/history/msg', (req, res) => {
  let { sender, receiver } = req.body;
  let sql = `select * from message where (sender = '${sender}' and receiver= '${receiver}') OR (sender = '${receiver}' and receiver= '${sender}')`;
  MessageDB.queryData(sql).then((users) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.send(users);
  });
});
//创建群聊
app.post('/api/group/add', (req, res) => {
  let form = req.body;
  /// 新增群聊
  let tileData = [[form.name, form.members]];
  let insertTileSql = 'insert into group(name, members) values(?, ?)';
  GroupDB.insertData(insertTileSql, tileData);

  let sql = `select * from user where username = '${form.username}' and password = '${form.password}'`;
  UserDB.queryData(sql).then((users) => {
    // 向所有用户广播有新用户增加
    let msg = {
      type: 'user',
    };
    [...clientsInfo.values()].forEach((ws) => {
      ws.send(JSON.stringify(msg));
    });
    //   返回用户信息
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200);
    res.send(users[0]);
  });
});
