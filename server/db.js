var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var DB = DB || {};

DB.SqliteDB = function (file) {
  let dbFile = path.resolve('../db', file);
  console.log(dbFile)
  DB.db = new sqlite3.Database(dbFile);

  DB.exist = fs.existsSync(dbFile);
  if (!DB.exist) {
    console.log('Creating db file!');
    fs.openSync(dbFile, 'w');
  }
};

DB.printErrorInfo = function (err) {
  console.log('Error Message:' + err.message + ' ErrorNumber:' + err);
};

DB.SqliteDB.prototype.createTable = function (sql) {
  DB.db.serialize(function () {
    DB.db.run(sql, function (err) {
      if (null != err) {
        DB.printErrorInfo(err);
        return;
      }
    });
  });
};

/// tilesData format; [[level, column, row, content], [level, column, row, content]]
DB.SqliteDB.prototype.insertData = function (sql, objects) {
  DB.db.serialize(function () {
    var stmt = DB.db.prepare(sql);
    for (var i = 0; i < objects.length; ++i) {
      stmt.run(objects[i]);
    }

    stmt.finalize();
  });
};
DB.SqliteDB.prototype.addOrUpdate = function (sql, objects) {
  this.queryData(sql);
};

DB.SqliteDB.prototype.queryData = function (sql, callback = dataDeal) {
  return new Promise((resolve) => {
    DB.db.all(sql, function (err, rows) {
      if (null != err) {
        DB.printErrorInfo(err);
        return;
      }
      /// deal query data.
      resolve(callback(rows));
    });
  });
};

DB.SqliteDB.prototype.executeSql = function (sql) {
  DB.db.run(sql, function (err) {
    if (null != err) {
      DB.printErrorInfo(err);
    }
  });
};

DB.SqliteDB.prototype.close = function () {
  DB.db.close();
};
function dataDeal(objects) {
  return objects;
}
/// export SqliteDB.
exports.SqliteDB = DB.SqliteDB;
