var express = require('express');
var router = express.Router();
var fs = require('fs')
const path=require('path')
let formidable = require('formidable');
router.post('/upfile.action', function (req, res, next) {

    var form = new formidable.IncomingForm();
    form.maxFileSize=200*1024*1024;
    form.on('progress',function (bytesReceived, bytesExpected) {
        var progressInfo = {
            value: bytesReceived,
            total: bytesExpected
        };
        //console.log('[progress]: ' + JSON.stringify(progressInfo));
        //res.write(JSON.stringify(progressInfo));
        //console.log('bytesReceived:%s  bytesExpected:%s',bytesReceived,bytesExpected)
    })
    form.on('error',function (err) {
        console.log(err)
    })
    form.parse(req,function (err, fields, files) {

        //console.log(fields)
        console.log(files)

        if (err){
            console.log(err)
            res.writeHead(405, {'content-type': 'text/plain;charset=utf-8'})
            res.write(JSON.stringify({message:'上传失败',date:(new Date()).toDateString(),err:err.message}));
            res.end();
        }
        else
        {
            for (let i = 0; i < 10; i++)
            {
                //console.log(files[i]);
                //console.log(files[i].path)
                let d="file"+(i+1);
                //console.log(files[d])
                if (files[d]===undefined)
                {
                    continue
                }
                console.log("保存文件路劲:"+  path.join(__dirname,'../public/updir/') + files[d].name)
                fs.rename(files[d].path,path.join(__dirname,'../public/updir/') + files[d].name,(err)=>{
                    if (err)
                    {
                        console.log('文件保存失败')
                    }
                })
            }
            res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'})
            //res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'})//text/plain  apllication/json
            res.write(JSON.stringify({message:'上传成功',date:(new Date()).toDateString()}));
            res.end();
        }
    })
    /*console.log("上传文件信息:%s", req.files+"__dirname"+__dirname)
    var des_file =  "./public/updir/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            var response;
            if (err) {
                console.log(err)
                response = {
                    message: 'file Upload fail',
                    filename: req.files[0].originalname
                };
            } else {
                response = {
                    message: 'file Upload successfully',
                    filename: req.files[0].originalname
                };
                console.log(response)
                res.end(JSON.stringify(response))
            }
        })
    })*/
   // console.log(req)
   //  res.end(JSON.stringify({message:'保存成功'}))
});
router.get('/',function (req,res,next) {
    res.redirect('/uploadfile.html')
})

module.exports = router;
