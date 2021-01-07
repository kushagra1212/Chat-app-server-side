const express=require('express');
const router=express.Router();
const {getusers,getuser,getusersfromroom} = require('../users');
const ourusers = require("./schema.js");
const bcrypt=require('bcrypt');
const salt=4;

router.get('/',(req,res)=>
{
    res.json(getusers());
    
    
    
    


});

router.get('/users',async(req,res)=>{
    const ouruser=await ourusers.find();
    res.json(ouruser);
})
router.get('/user',async(req,res)=>{
    var {name,password}=req.query;
const us=await ourusers.findOne({name:name});

if(us)
{
    bcrypt.compare(password,us.password,(err,resa)=>{
        if(resa==true)
        {
           
            res.json({message:"Successfully Registered"})
            return;
        }
        res.status(404).json({message:'sasc'});
        return;
         
    
    })
}else{
    res.status(404).json({message:'sasc'});
    return;
}
    
  

    
    
})
router.post('/post',async(req,res)=>{
    const {name,email,password}=req.body;
const us=await ourusers.findOne({name:name});

if(us){
res.status(400).send({message:"user name already exist"});
return;
} 
else{
    
    bcrypt.hash(password,salt,async(err,hash)=>{
       if(err) console.log(err)
       else{
        const   user=new ourusers({
            name:name,password:hash,email:email
        });
        await user.save();
       }
      })
      res.send({message:"registered successfully"})
      return;
}
 


 

})




router.get('/favicon.ico',(req,res)=>
{
    res.send("ho")
})


module.exports=router;