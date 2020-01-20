const queryString = require('querystring')
const handleRouterBlog = require('./src/router/blog.js')
const handleRouterUser = require('./src/router/user.js')
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
const serverHandle = (req,res)=>{
  //设置返回数据格式为json
  res.setHeader('Content-type','application/json')
  //获取path
  const url = req.url
  req.path = url.split('?')[0]
  req.query = queryString.parse(url.split('?')[1])

  getPostData(req).then( postData => {
    req.body = postData
    //处理博客相关路由
    const blogResult = handleRouterBlog(req,res)
    if(blogResult){
      blogResult.then(blogData=>{
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }
    //处理用户相关路由
    const userData = handleRouterUser(req,res)
    if(userData){
      res.end(
        JSON.stringify(userData)
      )
      return
    }
    //未命中路由，返回404
    res.writeHead(404,{'Content-type':'text/plain'})
    res.write("404 Not Found")
    res.end()
  })
}
module.exports = serverHandle