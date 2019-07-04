var mongoose=require('mongoose')
const config=require('../config')
console.log(config[config.mode].mongodb)
mongoose.connect(config[config.mode].mongodb)
mongoose.connection.on('error', err=>{
    console.error("Mongodb open no:"+ err);
});
mongoose.connection.on('open', function() {
  // we're connected!
  console.log('Mongodb open ok')
});
var Schame=mongoose.Schema;
module.exports=mongoose.model('user',new Schame({
    username:String,
    password:String
}))