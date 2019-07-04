const  express=require('express')
const router=express.Router()
router.get('/getdata',function (req,res,next) {
    res.redirect('/getDatatable.html')
})
module.exports=router
