const mongoose = require("mongoose")

const mongoUrl = "mongodb+srv://sainirahul8967:Rahul%408967@cluster0.lc2db.mongodb.net/shopito?retryWrites=true&w=majority";





const connectDb=()=>{
            return mongoose.connect(mongoUrl);
           

}
module.exports={connectDb}