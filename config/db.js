const mysql = require('mysql2/promise')
const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});
console.log(process.env.DB_NAME)

pool.getConnection()
    .then(connection =>{
        console.log("Db connected");
        connection.release;
    })
    .catch(err =>{
        console.error("DB connection failed "+ err.message);

    })

module.exports = pool;