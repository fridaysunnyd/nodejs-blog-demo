const { exec } = require('../../db/mysql') 
const login = (postData={})=>{
  const username = postData.username
  const password = postData.password
  let sql = `select * from users where username='${username}' and password='${password}'`
  return exec(sql).then(rows=>{
    return rows[0] || {}
  })
}
module.exports = {
  login
}