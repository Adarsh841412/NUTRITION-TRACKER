const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cors = require('cors');
    require('dotenv').config();
const dbUrl=process.env.ATLASDB_URL

// importing models 
const userModel = require('./models/userModel')
const foodModel = require("./models/foodModel")
const trackingModel = require("./models/trackingModel")
const verifyToken = require("./verifyToken")

// database connection 
mongoose.connect(dbUrl)
.then(()=>{
    console.log("Database connection successfull")
})
.catch((err)=>{
    console.log(err);
})



  const store=MongoStore.create({ 

    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET
    },
    touchAfter:24*3600,
    
     });



     

store.on("error",()=>{
  console.log("ERROR  in MONGO SESSION STORE", err)
})

//* 2 here i define session optionn s

const seesionOptions={
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,

  cookie:{   //*4 here i add cookies in session options 
    expires:Date.now()+7*24*60*60*1000, //* 5 here i define expiry date of cookies measn ye kookie 7 din baad expire ho jayega yah pai 7 din(24 hour,60 min  60 sec and 1000 milisec)
    maxAge:7*24*60*60*1000 ,//* 6 here i define 7 days after this cookiew will expire 
    //* 7 after adding this if you go in expires option in cookies you got date of expiry of you cookie\
    httpOnly:true  //*  8 isko ham bydefault true kr dete hai iska use security purpose ke lia hota hai search crosscrypting attack to know about this 
  }
}


const app = express();

app.use(express.json());
app.use(cors());


// endpoint for registering user 
app.post("/register", (req,res)=>{
    
    let user = req.body;
   

    bcrypt.genSalt(10,(err,salt)=>{
        if(!err)
        {
            bcrypt.hash(user.password,salt,async (err,hpass)=>{
                if(!err)
                {
                    user.password=hpass;
                    try 
                    {
                        let doc = await userModel.create(user)
                        res.status(201).send({message:"User Registered"})
                    }
                    catch(err){
                        console.log(err);
                        res.status(500).send({message:"Some Problem"})
                    }
                }
            })
        }
    })

    
})


// endpoint for login 

app.post("/login",async (req,res)=>{

    let userCred = req.body;

    try 
    {
        const user=await userModel.findOne({email:userCred.email});
        if(user!==null)
        {
            bcrypt.compare(userCred.password,user.password,(err,success)=>{
                if(success==true)
                {
                    jwt.sign({email:userCred.email},"nutrifyapp",(err,token)=>{
                        if(!err)
                        {
                            res.send({message:"Login Success",token:token,userid:user._id,name:user.name});
                        }
                    })
                }
                else 
                {
                    res.status(403).send({message:"Incorrect password"})
                }
            })
        }
        else 
        {
            res.status(404).send({message:"User not found"})
        }


    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem"})
    }



})

// endpoint to fetch all foods 

app.get("/foods",verifyToken,async(req,res)=>{

    try 
    {
        let foods = await foodModel.find();
        res.send(foods);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem while getting info"})
    }

})

// endpoint to search food by name 

app.get("/foods/:name",verifyToken,async (req,res)=>{

    try
    {
        let foods = await foodModel.find({name:{$regex:req.params.name,$options:'i'}})
        if(foods.length!==0)
        {
            res.send(foods);
        }
        else 
        {
            res.status(404).send({message:"Food Item Not Fund"})
        }
       
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem in getting the food"})
    }
    

})


// endpoint to track a food 

app.post("/track",verifyToken,async (req,res)=>{
    
    let trackData = req.body;
   
    try 
    {
        let data = await trackingModel.create(trackData);
        console.log(data)
        res.status(201).send({message:"Food Added"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem in adding the food"})
    }
    


})


// endpoint to fetch all foods eaten by a person 

app.get("/track/:userid/:date",async (req,res)=>{

    let userid = req.params.userid;
    let date = new Date(req.params.date);
    let strDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

    try
    {

        let foods = await trackingModel.find({userId:userid,eatenDate:strDate}).populate('userId').populate('foodId')
    console.log(foods)
        res.send(foods);

    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem in getting the food"})
    }


})



app.listen(8000,()=>{
    console.log("Server is up and running");
    console.log(dbUrl)
})
