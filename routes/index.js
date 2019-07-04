var express = require('express');
var router = express.Router();
var uuid = require('uuid')
const dbhelper=require('../DbHelper/dbHelper')

/* GET home page. */
router.get('/', function (req, res, next) { 
    res.render('index')
});
router.get('/index', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    res.render('index')
});
router.get('/download', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    res.render('./public/exe/latest.yml')
});

module.exports = router;
