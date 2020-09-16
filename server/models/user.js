const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
console.log(ObjectId);
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    pic:{
        type:String,
        default: "https://res.cloudinary.com/krishnatyagi12/image/upload/v1597221592/nopic_gcdayv.png"
    },
    followers:[{type: ObjectId, ref:"User"}],
    following:[{type: ObjectId, ref:"User"}]

});

mongoose.model("User", userSchema);