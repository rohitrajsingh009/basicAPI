 import UserModel from '../models/User.js';
 import ConnectModel from '../models/ContactUs.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../config/emailConfig.js';

class UserController {
    static userRegistration = async (req,res)=>{
        const {name,email,phone, qualification,course, mode,address, dateOfJoining, password, password_confirmation,tc} = req.body
        const user = await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"falied", "message":"email already exist"})
        }else{
            if(name && email && password && password_confirmation,tc){
                if(password === password_confirmation){
                  try{
                    const salt = await bcrypt.genSalt(12);
                    const hashPassword = await bcrypt.hash(password,salt);
                    const doc = new UserModel({
                        name:name,
                        email:email,
                        phone:phone,
                        qualification:qualification,
                        course:course,
                        mode:mode,
                        address:address,
                        dateOfJoining:dateOfJoining,
                        password:hashPassword,
                        ts:tc
                    })
                    await doc.save()
                    const saved_user = await UserModel.findOne({email:email})
                    //generate jwt token
                    const token = jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                    res.status(200).send({'success':true,token:token})
                  }catch(err){
                    res.send({"status":"failed","message":err})
                  }
                }else{
                    res.send({"status":"failed","message":"password & confirm passoword doesn't match "})
                }
            }else{
                res.send({"status":"failed","message":"all fields are required" })
            }
        }
    }
    static userLogin = async (req,res)=>{
         try{
            const {email,password} = req.body;
            if(email && password){
                const user = await UserModel.findOne({email:email});
                if(user != null){
                    const isMatch= await bcrypt.compare(password, user.password)
                    if(user.email === email && isMatch ){
                       
                        
                    //generate jwt token
                    const token = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                   
                        res.send({status:'success',messge:'login success',token:token})
                    }else{
                        res.send({status:'failed',message:'email or password is wrong'})
                    }
                }else{
                    res.send({status:'failed',message:'you are not registered with us'})
                }
            }else{
                res.send({status:'failed',message:'all fields are required'})
            } 
         }catch(err){
            
            res.send({status:'failed',message:'unable to login'})
         }
    }
    static changeUserPassword = async (req,res)=>{
        const {password,password_confirmation} = req.body;
        if(password && password_confirmation){
            if(password === password_confirmation){
                const salt = await bcrypt.genSalt(12);
                const hashPassword = await bcrypt.hash(password,salt);
                //console.log(req.user._id)
                await UserModel.findByIdAndUpdate(req.user._id,{$set: {password:hashPassword}})
                res.send({status:'success',message:'password change successfully'})
            }else{
                res.send({status:'failed',message:'both password not matched'})
            }
        }else{
            res.send({status:'failed',message:'not matched'})
        }
    }
    static loggedUser = async (req,res)=>{
        res.send({user:req.user})
    }
    static sendUserPasswordResetEmail = async(req,res)=>{
        const {email} = req.body;
        if(email){
            const user = await UserModel.findOne({email:email});
        
            if(user){
                const secret = user._id+ process.env.JWT_SECRET_KEY;
                const token = jwt.sign({userID:user._id},secret,{expiresIn:'15m'})
                            //  /api/user/reset/:id/:token
                const link = `http://localhost:4200/reset/${user._id}/${token}`
                //console.log("link ",link)
                               //send email
                               let info = await transporter.sendMail({
                                from:process.env.EMAIL_FROM,
                                to:user.email,
                                subject:'Hinsar-HAPL-Reset password link',
                                html:`<a href=${link}> Click Here</a> to reset your password`
                               })
                res.send({status:'success',info:info,message:'passowrd reset email send..please check your email',link:link})
            }else{
                res.send({status:'failed',message:'email does not exist'});
            }
        }else{
            res.send({status:'failed',message:'email is required'})
        }
    }
    static userPasswordReset=async(req,res) =>{
        const {password,password_confirmation} = req.body
        const {id,token}= req.params;
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try{
            jwt.verify(token,new_secret)
            if(password && password_confirmation){
                if(password ===password_confirmation){
                    const salt = await bcrypt.genSalt(12);
                    const newHashPassword = await bcrypt.hash(password,salt)
                    await UserModel.findByIdAndUpdate(user._id, {$set:
                    {password:newHashPassword}})
                    res.send({status:'success',message:'password reset successfully'})
                }else{
                    res.send({'status':'failed',message:'password does not match'})
                }
            }else{
                res.send({status:'failed',message:'all fields are required'})
            }
        } catch(err){
            res.send({'status':'failed',message:'invalid token'})
        }
    }
    static userConnect = async (req,res)=>{
        const {name,email,phone,description} = req.body
       
            if(name && email && phone && description){
              
                  try{
                    const doc = new ConnectModel({
                        name:name,
                        email:email,
                        phone:phone,
                        description:description,
                    })
                    await doc.save()
                    const saved_query = await ConnectModel.findOne({email:email})
                    //generate jwt token
                    res.status(200).send({'success':true,saved_query,message:'query send successfully'})
                  }catch(err){
                    res.send({"status":"failed","message":err})
                  }
                
            }else{
                res.send({"status":"failed","message":"all fields are required" })
            }
        
    }
}

export default UserController