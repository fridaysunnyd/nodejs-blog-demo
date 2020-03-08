var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  creat,
  update,
  del
} = require('../controller/blog.js')
const {SuccessModel,ErrorModel} = require('../model/model.js')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', function(req, res, next) {
  let author = req.query.author || ''
  const keyWord = req.query.keyWord || ''
  if(req.query.isadmin){
    //管理员界面
    if(req.session.username == null){
      res.json(
        new ErrorModel('未登录')
      )
      return
    }
    //强制查询自己博客
    author = req.session.username
  }
  const result = getList(author,keyWord)
  return result.then(data=>{
    res.json(
      new SuccessModel(data)
    )
  })
});

router.get('/detail',function(req,res,next){
  const result = getDetail(req.query.id)
  return result.then(data=>{
    res.json(
      new SuccessModel(data)
    )
  })
})
router.post('/new',loginCheck,function(req,res,next){
  req.body.author = req.session.username
  const result = creat(req.body)
  return result.then(data =>{
    const insertId = data.insertId
    res.json(
      new SuccessModel(insertId)
    )
  })
})
router.post('/update',loginCheck,function(req,res,next){
  const result = update(req.query.id,req.body)
  return result.then(data =>{
    if(data.affectedRows > 0){
      res.json(
        new SuccessModel()
      )
    }else{
      res.json(
        new ErrorModel('更新失败')
      )
    }
  })
})
router.post('/del',loginCheck,function(req,res,next){
  req.body.author = req.session.username
  const result = del(req.query.id,req.body)
  return result.then(data =>{
    if(data){
      res.json(
        new SuccessModel()
      )
    }else{
      res.json(
        new ErrorModel('删除失败')
      )
    }
  })
})

module.exports = router;
