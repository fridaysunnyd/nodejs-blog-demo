const { exec } = require('../db/mysql') 
const { xss } = require('xss')
const getList = (author,keyword) =>{
  let sql = `select * from blogs where 1=1 `
  if(author){
    sql += `and author='${author}' `
  }
  if(keyword){
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc`
  return exec(sql)
}
const getDetail = (id) =>{
  let sql = `select * from blogs where id='${id}'`
  return exec(sql)
}
const creat = (postData={}) =>{
  const title = xss(postData.title)
  const content = xss(postData.content)
  const author = postData.author || '佚名'
  const createTime = Date.now()
  let sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}','${createTime}','${author}')`
  return exec(sql)
}
const update = (id,postData={}) =>{
  const title = postData.title
  const content = postData.content
  let sql = `update blogs set title = '${title}',content = '${content}' where id = ${id}`
  return exec(sql)
}
const del = (id,postData={}) =>{
  const author = postData.author || '佚名'
  let sql = `delete from blogs where id = ${id} and author='${author}'`
  return exec(sql)
}
module.exports = {
  getList,
  getDetail,
  creat,
  update,
  del
}