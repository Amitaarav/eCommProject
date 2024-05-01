/**
 * This will be the starting file of the project
 */

const express = require("express")
const mongoose = require("mongoose")
const app = express()
const server_config = require("./configs/server.config")
const db_config = require("./configs/db.config")
const user_model = require("./models/user.model")
const bcrypt = require("bcryptjs")
app.use(express.json())//Middleware JSON--->JS Object

/**
 * Create an admin user at the starting of the application
 * if not already present
 */
//2::
//connection with mongodb
mongoose.connect(db_config.DB_URL)
const db = mongoose.connection

db.on("error",()=>{
    console.log('Error while connecting to the mongoose')
})

db.once("open",()=>{
    console.log("connected with mongodb")
    init()
})

//3::initialise the database
async function init(){
    
    try {
        //creating the user
        //let is used to redefine user
        let user = await user_model.findOne({userId: "admin"})
        if(user){
            console.log("Admin is already present")
            return 
        }
    } catch (error) {
        console.log("Error found while creating data")
    }

    try {
        user = await user_model.create({
            name : "Amit Kumar Gupta",
            userId : "admin",
            email :"amitlksgupta556@gmail.com",
            userType : "ADMIN",
            password : bcrypt.hashSync("AmGm#@555",8) //not encrypted form of password
            // hashsync: find the hash in a synchronous way
            // 8 used as salt
            //salt::
        })
        console.log("Admin created",user)
    } 
    catch (err) {
        console.log("Error while creating admin",err)
    }
}
/**
 * stich the route to the server
 */
require("./routes/auth.routes")(app)
/**
 * 1st::start the server
 */
app.listen(server_config.PORT,()=>{
    console.log("server started AT port number : ",server_config.PORT)
}) 
