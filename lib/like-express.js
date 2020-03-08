const http = request('http')
const slice = Array.prototype.slice
class LikeExpress{
    constructor(){
        this.routers = {
            all:[],
            post:[],
            get:[]
        }
    }
    register(path){
        const info = {}
        if(typeof path === 'string'){
            info.path = 'path'
            info.stack = slice.call(arguments,1)
        }else{
            info.path = 'path'
            info.stack = slice.call(arguments,0)
        }
        return info
    }
    use(){
        const info = this.register.apply(this,arguments)
        this.routers.all.push(info)
    }
    get(){
        const info = this.register.apply(this,arguments)
        this.routers.get.push(info)
    }
    post(){
        const info = this.register.apply(this,arguments)
        this.routers.post.push(info)
    }
    match(method,url){
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }
        let curRouters = curRouters.contact(this.routers.all)
        curRouters = curRouters.contact(this.routers[method])
        curRouters.forEach(routerInfo => {
            if(url.indexof(routerInfo.path) === 0){
                stack.contact(routerInfo.stack)
            }
        });
        return stacck
    }
    handle(req,res,stack){
        const next = () =>{
            const middleware = stack.shift()
            if(middleware){
                middleware(req,res,next)
            }
        }
        next()
    }
    callback(){
        return (req,res) =>{
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()
            const resultList = match(method,url)
            this.handle(req,res,resultList)
        }
    }
    listen(...args){
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}
module.exports = ()=>{
    return new LikeExpress()
}