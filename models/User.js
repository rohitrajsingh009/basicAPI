import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    phone:{type:Number,},
    qualification:{type:String,},
    course:{type:String},
    mode:{type:String},
    address:{type:String},
    dateOfJoining:{type:String},
    password:{type:String,required:true,trim:true},
    tc:{type:Boolean,}
})
const UserModel = mongoose.model("allUser",userSchema)
export default UserModel