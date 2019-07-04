var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer  = require('multer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadfileRouter = require('./routes/uploadfile');
var getdataRouter=require('./routes/getTable')
var  api=require('./routes/api')

var session=require('express-session')

var config=require('./config')
const jwt = require('jsonwebtoken')
//var routes=require('./routes/users')


var app = express();
console.log(config.mode)
console.log(config[config.mode].mongodb)
//var mongoose=require('mongoose')
//mongoose.createConnection(config[config.mode].mongodb)
app.set('superSecret',config[config.mode].jwtsecret)


app.all('*', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址

  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");

  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  // console.log('Token:'+req.headers['token'])
  console.log(req.url)
  if(req.url.indexOf('api')!=-1 && req.url.indexOf('/api/login') ==-1){
          res.header('content-type','application/json;charset=utf-8' );
          jwt.verify(req.headers['token'],config[config.mode].jwtsecret,(err,decode)=>{
            if(err)
            {
              res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' })
              res.write(JSON.stringify({
                  code: 403,
                  msg: 'token不正确',
                  result: {
                      value: 'no'
                  }
              }))
              res.end()
            }
            else
            {
              next()
            }
          })
  }
  else
  {
    next();
  }
 

});
 
app.use(session({name:'my-session',resave:true,saveUninitialized:false,secret:'my-session-id',cookie:{maxAge:60*1000,httpOnly:true}}));
//app.use(bodyParser.urlencoded({ extended: false ,limit:'10000kb'}));

//app.use(multer({ dest: '/tmp/'}).array('image'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',require('ejs').__express);
app.set('view engine', 'html');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static('public'))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/uploadfile',uploadfileRouter)
app.use('/api',api)
//app.use(routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error:');
  res.render('error.pug');
});

module.exports = app;
