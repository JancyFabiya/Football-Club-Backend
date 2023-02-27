const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config();
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const cloudinary = require("cloudinary")





//Connectiong to Database

const connectDatabase = require('./config/database')

connectDatabase()


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,

})

const app = express()



//Middleware
app.use(cookieParser());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({limit: '1000mb',extended:true}))
app.use(express.json())

//cors
// app.use(cors());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        method : ["GET","POST","PUT","DELETE"],
        credentials: true,
    })
);



//Route Import

const user = require('./routes/userRoute')
const club = require('./routes/clubRoute')


// User Route
app.use('/api/v1',user)
app.use('/api/v1',club)






const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is Running ${PORT}`))