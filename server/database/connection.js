const mysql = require('mysql2/promise');
const mySqlPassword = process.env["osltl_mysql_password"] || "testpassword";
const mySqlUser = process.env["osltl_mysql_user"] || "root";
const mySqlHost = process.env["osltl_mysql_host"] || "localhost";
const mySqlDatabase = process.env["osltl_mysql_database"] || 'osltl';
const pool = mysql.createPool({
    host: mySqlHost,
    user: mySqlUser,
    password: mySqlPassword,
    database: mySqlDatabase,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  module.exports = pool;