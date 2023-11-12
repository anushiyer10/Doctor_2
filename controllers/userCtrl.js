const userModel = require('../models/userModels.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel =  require('../models/doctorModel.js')
// register callback
const registerController = async (req,res) =>{
    try{
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({success:false,message:'User Already Exist'})
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password,salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({success:true,message:"Registered Successfully"})
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({success:false,message:`Register Controller ${error.message}`})
    }
};

// login callback
const loginController = async(req,res)=>{
    try{
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({message:"user not found",success:true})
        }
        const isMatch = await bcrypt.compare(req.body.password,user.password)
        if(!isMatch){
            return res.status(200).send({success:false,message:"Invalid Email or Password"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'15d'})
        res.status(200).send({success:true,message:'Login Success',token})
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({message:`Error is login CTRL ${error.message}`})
    }
}

const authController = async(req,res)=>{
    try{
        const user = await userModel.findById({_id:req.body.userId})
        user.password = undefined;
        if(!user){
            return res.status(200).send({
                success:false,
                message:"User not Found"
            });
        }
        else{
           res.status(200).send({
            success:true,
            data:user
        });
        }

    }
    catch(error){
        console.log(error);
        res.status(500).send({success:false,message:"Auth error",error})
    }
}

const applyDoctorControl  = async (req,res) => {
    try {
       const newDoctor  =  await doctorModel({...req.body,status:'pending'})
       await newDoctor.save() 
       const adminUser  =  await userModel.findOne({isAdmin:true})
       const notification = adminUser.notification
       notification.push({
        type:'apply-doctor-request',
        message:`${newDoctor.firstName} ${newDoctor.lastName} Has Applied for Doctor Account`,
        data: {
            doctorId: newDoctor._id,
            name: newDoctor.firstName + " " + newDoctor.lastName,
            onClickPath: '/admin/doctors'
        }
       });
       await userModel.findByIdAndUpdate(adminUser._id,{notification})
       res.send(201).send({
        success:true,
        message:'Doctor account applied successfully'
       })
    } catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message: 'Error while Applying For Doctor'
        })
    }
}

module.exports = {loginController,registerController,authController,applyDoctorControl};