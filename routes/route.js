const express=require('express');
const router=express.Router();


router.get('/',(req,res)=>
{
    res.send("from the server side");


});
router.get('/favicon.ico',(req,res)=>
{
    res.send("ho")
})


module.exports=router;