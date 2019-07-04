var express = require('express');
var router = express.Router();
const dbherp = require('../DbHelper/dbHelper')
const config = require('../config.js')
var User = require('../models/user')
const jwt = require('jsonwebtoken')
const format= require('string-format')
const redis=require('redis')
var client=redis.createClient(6379,'localhost')

/* GET users listing. */
router.post('/login', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password
    dbherp.getDataTable('select * from userinfo where userid="' + username + '" and password="' + password + '" ').then(data => {
        if (data.length > 0) {
            var newuser = new User({
                username: username,
                password: password
            })
            newuser.save(function (err) {
                if (err) {
                    console.log("用户信息保存失败")
                }
                else {
                    console.log("用户信息保存成功")
                }
            })
            // User.findOne({ username: username }, (err, user) => {
            //     console.log("查询信息:" + user)
            // })

            var token = jwt.sign(newuser.toJSON(), config[config.mode].jwtsecret, {
                expiresIn: 24 * 60 * 60  //授权24小时
            })
            //console.log(token)
            res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' })
            res.write(JSON.stringify({
                code: 1,
                msg: '登录成功',
                result: {
                    token: token,
                    username: data[0].username
                }
            }));
            res.end();
        }
        else {
            res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' })
            res.write(JSON.stringify({
                code: 0,
                msg: '用户名或密码不正确',
                result: {
                    token: '',
                    username: ''
                }
            }));
            res.end();
        }
    })
        .catch(err => {
            res.writeHead(403, { 'content-type': 'text/plain;charset=utf-8' })
            res.write(JSON.stringify({
                code: 0,
                msg: '403',
                result: {
                    token: '',
                    username: ''
                }
            }));
            res.end();
        })
});
/* getUserinfo */
router.get('/getuserinfo', (req, res, next) => {
    console.log("token:" + req.headers['token'])
    var token = req.headers['token']
    res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' })
    res.write(JSON.stringify({
        code: 1,
        msg: '请求正常',
        result: {
            value: token
        }
    }))
    res.end()
    // jwt.verify(token,config[config.mode].jwtsecret,(error,decoded)=>{
    //     if(error)
    //     {
    //         res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' })
    //         res.write(JSON.stringify({
    //             code: 403,
    //             msg: 'token不正确',
    //             result: {
    //                 value: 'no'
    //             }
    //         }))
    //         res.end()
    //     }
    //     else
    //     {
    //         res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' })
    //         res.write(JSON.stringify({
    //             code: 1,
    //             msg: '请求正常',
    //             result: {
    //                 value: 'ok'
    //             }
    //         }))
    //         res.end()
    //     }
    // })

});
router.get('/getproductinfo', (req, res, next) => {
    var p_id = req.query.p_name;
    var condition = '';
    if (p_id !== '' && p_id !== undefined) {
        condition = ' p_name=' + "'"+p_id+"'";
    }
    else {
        condition = '1=1';
    }
    var sql='select * from productinfo where '+condition+' ';
    console.log(sql)
    dbherp.getDataTable(sql).then(data => {
        //console.log(data)
        res.write(JSON.stringify({
            code: 1,
            msg: '请求正常',
            result: {
                p_datas: data
            }
        }))
        res.end()
    }).catch(err => {
        res.write(JSON.stringify({
            code: 0,
            msg: '数据查询失败',
            result: {
                p_datas: []
            }
        }))
        res.end()
    })

})
router.post('/addproduct',(req,res,next)=>{
    var p_name=req.body.p_name;
    var p_price=req.body.p_price;
    var p_desc=req.body.p_desc;
    //INSERT INTO `yidianma`.`productinfo` (`p_id`, `p_name`, `p_price`, `p_desc`, `p_create`, `p_pic`) VALUES ('2', '2', '2', '2', '2019-05-20 10:01:50', '222');

    var sql=format('insert into productinfo ("p_name","p_price","p_desc","p_create","p_pic") values ({0},{1},{2},{3},{4}) ',p_name,p_price,p_desc,new Date(),'');
    //console.log(sql)
    try{
    dbherp.insert('productinfo',{p_name:p_name,p_price:p_price,p_desc:p_desc,p_create:new Date(),p_pic:''}).then(data=>{
             console.log(data)
             res.write(JSON.stringify({
                code: 1,
                msg: '插入成功',
                result: {
                    p_id: data
                }
             }))
             res.end()
    }).catch(err=>{
        console.log(err)
        res.write(JSON.stringify({
            code: 0,
            msg: '插入失败',
            result: {
                p_id: 0
            }
         }))
         res.end()
    })
}
catch(e){
    console.log(e)
}
})
router.post('/upproduct',(req,res,next)=>{
    var p_name=req.body.p_name;
    var p_id=req.body.p_id;
    var p_price=req.body.p_price;
    var p_desc=req.body.p_desc;

    console.log(p_name)
    console.log(p_price)
    console.log(p_desc)
    console.log(p_id)
    try{
    dbherp.update('update productinfo set p_name=? , p_price=? , p_desc=? , p_create=? where p_id=?',[p_name,p_price,p_desc,new Date(),p_id]).then(data=>{
             console.log(data)
             res.write(JSON.stringify({
                code: 1,
                msg: '修改成功',
                result: {
                    p_id: data
                }
             }))
             res.end()
    }).catch(err=>{
        console.log(err)
        res.write(JSON.stringify({
            code: 0,
            msg: '修改失败',
            result: {
                p_id: 0
            }
         }))
         res.end()
    })
}
catch(e){
    console.log(e)
}
})
router.post('/delproduct',(req,res,next)=>{
   
    var p_id=req.body.p_id;
 
    try{
    dbherp.update('delete from productinfo   where p_id=?',[p_id]).then(data=>{
             console.log(data)
             res.write(JSON.stringify({
                code: 1,
                msg: '删除成功',
                result: {
                    p_id: data
                }
             }))
             res.end()
    }).catch(err=>{
        console.log(err)
        res.write(JSON.stringify({
            code: 0,
            msg: '删除失败',
            result: {
                p_id: 0
            }
         }))
         res.end()
    })
}
catch(e){
    console.log(e)
}
})
router.get('/getRedis',(req,res,next)=>{
     client.hgetall(req.query.key,(err,data)=>{
        res.write(JSON.stringify({
            code: 1,
            msg: '获取成功',
            result: {
                ds: data
            }
         }))
         res.end()
     })
      
    
})
module.exports = router;
