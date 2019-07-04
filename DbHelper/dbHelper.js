const mysql=require('mysql')
const config=require('../config')
const db=mysql.createConnection(config[config.mode].sql)
function DBMananger() {
    this.getDataTable=getDataTable;
    this.insert=insert;
    this.update=update
}
async function getDataTable(sql) {
 
    let res=await new Promise((func,obj)=>{
        db.query(sql,(err,data)=>{
            if (err)
            {
                func(err)
            }
            else
            {
                //console.log(data);
                
                func(data)
            }
        })
    })
    return res;
}
async function insert(tablename,value){
    let res=await new Promise((func,obj)=>{
        try{
            console.log(tablename+value)
            db.query('insert into '+tablename+' set  ?',value,function(err,reslut){
                if(err)
                {
                   console.log(err)
                   obj(err)
                }
                else
                {
                    func(reslut.insertId);
                }
            })
        }
        catch(e)
        {
            console.log(e)
            obj(e)

        }
      
    })
    return res;
}
async function update(sql,value){
    console.log(sql)
    console.log(value)
    let res=await new Promise((func,obj)=>{
        try{
            
            db.query(sql,value,function(err,reslut){
                if(err)
                {
                   console.log(err)
                   obj(err)
                }
                else
                {
                    func(reslut.affectedRows);
                }
            })
        }
        catch(e)
        {
            console.log(e)
            obj(e)

        }
      
    })
    return res;
}

const  dbm=new DBMananger();
module.exports=dbm