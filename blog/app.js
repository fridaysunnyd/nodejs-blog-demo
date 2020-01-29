const queryString = require('querystring')
const handleRouterBlog = require('./src/router/blog.js')
const handleRouterUser = require('./src/router/user.js')
const { set,get } = require('./db/redis')
const { access } = require('./src/utils/log')
//公有session数据
//let SESSION_DATA = {}
//处理post data
const getPostData = (req) => {
  const promise = new Promise((res,rej)=>{
    if(req.method !== 'POST'){
      res({})
      return
    }
    if(req.headers['content-type'] !== 'application/json'){
      res({})
      return
    }
    let postData = ''
    req.on('data',chunk => {
      postData += chunk.toString()
    })
    req.on('end',()=>{
      if(postData){
        res(
          JSON.parse(postData)
        )
      }else{
        res({})
        return
      }
    })
  })
  return promise
}
//获取过期时间
const getCoolieExpires = ()=>{
  const d = new Date()
  d.setTime(d.getTime() + (24*60*60*1000))
  return d.toGMTString()
}
const serverHandle = (req,res)=>{
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
  //设置返回数据格式为json
  res.setHeader('Content-type','application/json')
  //获取path
  const url = req.url
  req.path = url.split('?')[0]
  req.query = queryString.parse(url.split('?')[1])
  //解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || '' 
  cookieStr.split(';').forEach(item => {
    if(!item)return
    const arr = item.split('=')
    const key = arr[0] && arr[0].trim()
    const value = arr[1] && arr[1].trim()
    req.cookie[key] = value
  });
  //解析session
  /* let needSetCookie = false
  let userId = req.cookie.userId
  if(userId){
    if(!SESSION_DATA[userId]){
      SESSION_DATA[userId] = {}
    }
  }else{
    needSetCookie = true 
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId] */
  let needSetCookie = false
  let userId = req.cookie.userId
  if(!userId){
    needSetCookie = true 
    userId = `${Date.now()}_${Math.random()}`
    set(userId,{})
  }
  req.sessionId = userId
  get(req.sessionId).then(data=>{
    if(data == null){
      set(sessionId,{})
      req.session = {}
    }else{
      req.session = data
    }
    return getPostData(req)
  })
  .then( postData => {
    req.body = postData
    //处理博客相关路由
    const blogResult = handleRouterBlog(req,res)
    if(blogResult){
      blogResult.then(blogData=>{
        if(needSetCookie){
          res.setHeader('Set-Cookie',`userId=${userId}; path=/; httpOnly; expires=${getCoolieExpires()}`)
        }
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }
    //处理用户相关路由
    const userResult = handleRouterUser(req,res)
    if(userResult){
      userResult.then(userData=>{
        if(needSetCookie){
          res.setHeader('Set-Cookie',`userId=${userId}; path=/; httpOnly; expires=${getCoolieExpires()}`)
        }
        res.end(
          JSON.stringify(userData)
        )
      })
      return
    }
    //未命中路由，返回404
    res.writeHead(404,{'Content-type':'text/plain'})
    res.write("404 Not Found")
    res.end()
  })
}
module.exports = serverHandle