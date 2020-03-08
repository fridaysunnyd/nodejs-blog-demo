var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/model')
const { login } = require('../controller/user')

router.post('/login', function(req, res, next) {
  const result = login(req.body)
  //const result = login(req.query)
  return result.then(data=>{
    if(data.username){
      req.session.username = data.username
      res.json(
        new SuccessModel()
      )
    }else{
      res.json(
        new ErrorModel('登陆失败')
      )
    }
  })
});

module.exports = router;
