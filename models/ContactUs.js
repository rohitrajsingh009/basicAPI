import mongoose, { Schema } from "mongoose";

const connectSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    phone:{type:String,},
    description:{type:String,},
})
const ConnectModel = mongoose.model("contactUs",connectSchema)
export default ConnectModel