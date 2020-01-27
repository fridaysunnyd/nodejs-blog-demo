const redis = require('redis')
const { REDIS_CONF } = require('../config/db')

const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host)
redisClient.on('error',err=>{
    console.error(err)
})
function set (key,value){
    if(typeof value === 'object'){
        value = JSON.stringify(value)
    }
    redisClient.set(key,value,redis.print)
}
function get (key){
    const promise = new Promise((res,rej)=>{
        redisClient.get(key,(err,value)=>{
            if(err){
                rej(err)
                return
            }
            if(value == null){
                res(null)
                return
            }
            try{
                res(
                    JSON.parse(value)
                )
            }catch(ex){
                res(value)
            }
        })
    })
    return promise
}
module.exports = {
    set,
    get
}