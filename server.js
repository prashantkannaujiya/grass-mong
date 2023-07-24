var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
var bcrypt = require('bcrypt');
var userModel=require('./userModell')
var jwt=require('jsonwebtoken')
const e = require('express');
const { ObjectID } = require('bson');
const { json } = require('express');
var saltRounds = 10;

app.post('/register',async(req,res)=>{
  var t=await  bcrypt.hash(req.body.password, saltRounds)
  var k={username:req.body.username,password:t}
 
  var user=new userModel(k);
  console.log(user)
  user.save();
  res.send('success');
})
app.put('/login',(req,res)=>{
  userModel.find({username:req.body.username}).then(async (data)=>{
    if(data.length!=0)
    {
      var result=await bcrypt.compare(req.body.password,data[0].password);
      if(result)
      {
        console.log(data[0])
        var token=jwt.sign(data[0].username,'Vishnu')
res.send({message:'success',token,username:data[0].username})
      }
      else
      {
        res.send({message:'fail'})
      }
    }
    else
    {
      res.send({message:'fail'})
    }
  })
})
app.get('/auth/:token',(req,res)=>{ var tken=req.params.token;
  console.log(tken);
  var ds=jwt.verify(req.params.token,'Vishnu');
  console.log(ds)
  res.send({message:'approved',data:ds});
})
app.post('/submitTask',(req,res)=>{
  var f={title:req.body.title,description:req.body.description,date:req.body.date,status:'open'}
  userModel.findOneAndUpdate({username:req.body.username},{$push:{task:f}}).then((data)=>{console.log(data.task);res.send({message:'inserted'})})
})
app.get('/fetchAll/:token',(req,res)=>{
var user=req.params.token;
console.log(user)
userModel.find({username:user}).then((data)=>{
  if(data[0].task.length!=0)
  { 
    console.log(data[0].task)
    res.send(data[0].task);
  }
  else
  {
    res.send([])
  }
})
})
app.delete('/erase/:token',(req,res)=>{
  var t=req.params.token;
  console.log(t)
  userModel.findOneAndUpdate({'task.title':t},{$pull:{task:{title:t}}}).then((data)=>{
    console.log(data)
    res.send('Done');
  })
})
app.get('/getTask/:token',(req,res)=>{
  var t=req.params.token;
  
  userModel.find({'task.title':t}).then((data)=>{

   data[0].task.forEach((a)=>{
if(a.title==t)
{
  var q=[];
  q.push(a);
  console.log(q)
  res.send(q);
}
    })
      })
})
app.put('/updateTask',async(req,res)=>{
  console.log(req.body.identity)
  var z= await userModel.find({'task.title':req.body.identity});
  console.log(z)
  userModel.updateOne({'_id':z[0]._id,'task.title':req.body.identity},{$set:{'task.$.title':req.body.title,'task.$.description':req.body.description,'task.$.date':req.body.date}})
  .then((data)=>{
    console.log(data)
    res.send('done')
  })
})
app.get('/markClose/:token',(req,res)=>{
  userModel.update({'task.title':req.params.token},{$set:{'task.$.status':'closed'}})
  .then((data)=>{
    console.log(data)
    res.send('done')
  })
})
const port=process.env.PORT || 2100;
app.listen(port,()=>{console.log('server runnning on 2100')})