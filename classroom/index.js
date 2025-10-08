const express=require('express');
const session=require('express-session');


const app=express();

const sessionOptions={
     secret:'keybord',
    resave: false,
    saveUninitialized: true,
}
app.use(session(sessionOptions));

app.get('/register',(req,res)=>{
    let{name ='anonymous'}=req.query;
    res.send(name);
})

app.listen(3000,()=>{
    console.log('app is listen');
})