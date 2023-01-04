import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    tc:{type:Boolean,}
})
const UserModel = mongoose.model("allUser",userSchema)
export default UserModel