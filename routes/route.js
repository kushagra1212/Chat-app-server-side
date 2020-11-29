const express=require('express');
const router=express.Router();


router.get('/',(req,res)=>
{
    res.send("from the server side");

});


module.exports=router;