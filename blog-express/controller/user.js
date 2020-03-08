const { exec,escape } = require('../db/mysql') 
const { getPassword } = require('../utils/cryp')
const login = (postData={})=>{
  const username = escape(postData.username)
  let password = getPassword(postData.password)
  password = escape(password)
  let sql = `select * from users where username=${username} and password=${password}`
  return exec(sql).then(rows=>{
    return rows[0] || {}
  })
}
module.exports = {
  login
}