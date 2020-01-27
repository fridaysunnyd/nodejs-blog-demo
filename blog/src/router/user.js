const {login} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/model.js')
const {set} =require('../../db/redis')

const handleUserRouter = (req,res) =>{
  const method = req.method
  const path = req.path
  // 登陆
  if(method === 'POST' && path === '/api/user/login'){
    const result = login(req.body)
    //const result = login(req.query)
    return result.then(data=>{
      if(data.username){
        req.session.username = data.username
        set(req.sessionId,req.session)
        return new SuccessModel()
      }else{
        return new ErrorModel('登陆失败')
      }
    })
  }
  //检查是否登陆
  /* if(method === 'GET' && path === '/api/user/login-test'){
    if(req.session.username){
      return Promise.resolve(new SuccessModel(req.session))
    }
    return Promise.resolve(new ErrorModel('未登录'))
  } */
}
module.exports = handleUserRouter