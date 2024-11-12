const mongoose = require('mongoose')
const { Schema } = mongoose;
const usersSchema=new Schema({
    email: {type:String,
        required:true},
    password:{type:String, required:true},
    friends:[String],
    pendingRequests:[String]
})


module.exports=mongoose.model('Users', usersSchema)
