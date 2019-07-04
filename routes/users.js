var express = require('express');
var router = express.Router();
const  mysql=require('mysql')
const config=require('../config.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db=mysql.createConnection(config[config.mode].sql)
  db.query('select * from yd_grade', function (err, data) {
    if (err)
    {
      var user={Name:"fs",ID:1001}
      res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'})
      res.write(JSON.stringify(user));
      res.end()
    }
    else
    {
      console.log(data)
      res.write(JSON.stringify(data));
      res.end()
    }


  })


});

module.exports = router;
