const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

const con = mysql.createConnection(MYSQL_CONF)
con.connect()
function exec (sql){
  const promise = new Promise((res,rej)=>{
    con.query(sql,(err,result)=>{
      if(err){
        rej(err)
        return
      }
      res(result)
    })
  })
  return promise
}
module.exports = {
  exec,
  escape: mysql.escape
}