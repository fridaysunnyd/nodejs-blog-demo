const {
  getList,
  getDetail,
  creat,
  update,
  del
} = require('../controller/blog.js')
const {SuccessModel,ErrorModel} = require('../model/model.js')
const loginCheck = (req)=>{
  if(!req.session.username){
    return Promise.resolve(new ErrorModel('未登录'))
  }
}
const handleBlogRouter = (req,res) =>{
  const method = req.method
  const path = req.path
  const query = req.query
  const id = query.id
  // 获取博客列表
  if(method === 'GET' && path === '/api/blog/list'){
    let author = query.author || ''
    const keyWord = query.keyWord || ''
    if(req.query.isadmin){
      //管理员界面
      const loginCheckResult = loginCheck(req)
      if(loginCheckResult){
        return loginCheckResult
      }
      //强制查询自己博客
      author = req.session.username
    }
    const result = getList(author,keyWord)
    return result.then(data=>{
      return new SuccessModel(data)
    })
  }
  // 获取博客详情
  if(method === 'GET' && path === '/api/blog/detail'){
    const result = getDetail(id)
    return result.then(data=>{
      return new SuccessModel(data)
    })
  }
  // 新建一篇博客
  if(method === 'POST' && path === '/api/blog/new'){
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      return loginCheckResult
    }
    req.body.author = req.session.username
    const result = creat(req.body)
    return result.then(data =>{
      const insertId = data.insertId
      return new SuccessModel(insertId)
    })
  }
  // 更新一篇博客
  if(method === 'POST' && path === '/api/blog/update'){
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      return loginCheckResult
    }
    const result = update(id,req.body)
    return result.then(data =>{
      if(data.affectedRows > 0){
        return new SuccessModel()
      }else{
        return new ErrorModel('更新失败')
      }
    })
  }
  // 删除一篇博客
  if(method === 'POST' && path === '/api/blog/del'){
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      return loginCheckResult
    }
    req.body.author = req.session.username
    const result = del(id,req.body)
    return result.then(data =>{
      console.log(data)
      if(data){
        return new SuccessModel()
      }else{
        return new ErrorModel('删除失败')
      }
    })
  }
}
module.exports = handleBlogRouter