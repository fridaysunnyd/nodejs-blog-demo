const {loginCheck} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/model.js')

const handleUserRouter = (req,res) =>{
  const method = req.method
  const path = req.path
  // 登陆
  if(method === 'POST' && path === '/api/user/login'){
    const data = loginCheck(req.body)
    if(data){
      return new SuccessModel(data)
    }else{
      return new ErrorModel('登陆失败')
    }
  }
}
module.exports = handleUserRouter