const express=require('express');
const router=express.Router();
const {getusers,getuser,getusersfromroom} = require('../users');
let messages=[];

router.get('/',(req,res)=>
{
    res.json(getusers());
    
    
    
    


});
router.get('/g',(req,res)=>{

    res.json(messages);
})

router.post('/messages',(req,res)=>{
messages.push(req.body);
})
console.log(messages);
router.get('/favicon.ico',(req,res)=>
{
    res.send("ho")
})


module.exports=router;