const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
            return res.status(200).send({message:"welcome to ecommerce api-node",status:true})
})

module.exports=app;