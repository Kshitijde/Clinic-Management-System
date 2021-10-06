const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Symptom=require('./symptom')


const patientSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:
    {
        type:Number,
        required:true
    },
    contact_no:
    {
        type:Number,
        required:true
    },
    bloodGrp:
    {
        type:String,
        required:true
    },
    symptoms:
    {
        type:Array,
        required:true
    },
    prescriptions:
    {
        type:Array,
        required:true
    }
})

const doctorSchema=new mongoose.Schema({
    username:{

        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is invalid")
            }

        }
    },
    password:{
        type:String,
        trim:true,
        minlength:7,
        validate(value){
            // value.toLowerCase()==='password'
            if(value.toLowerCase().includes('password')){
                throw new Error("this password is not allowed")
            }
            
        }
    },
    //subcollection
    patients:[patientSchema],
    tokens:[{token:{
        type:String,
        required:true
    }}],
    avatar:{
        type:Buffer
    }
},{timestamps:true})

doctorSchema.methods.toJSON=function(){
    const doctor=this
    const doctorObject=doctor.toObject()

    delete doctorObject.password
    delete doctorObject.tokens
    delete doctorObject.avatar
    return doctorObject
}


doctorSchema.methods.generateAuthToken=async function(){
    const doctor=this
    const token=jwt.sign({_id:doctor._id.toString()},process.env.JWT_SECRET)
    doctor.tokens=user.tokens.concat({token})
    await doctor.save()
    
    return token

}

doctorSchema.statics.findByCredentials=async(email,password)=>{
    const doctor=await Doctor.findOne({email})
    if(!doctor){
        throw new Error('Unable to login')
    }

    const isMatch=await bcrypt.compare(password,doctor.password)

    if(!isMatch){
        throw new Error("Unable to login")
    }   
    
    return doctor
}



//hash the plain text password before saving
doctorSchema.pre('save',async function(next){
    const doctor=this
    if (doctor.isModified('password')){
        doctor.password=await bcrypt.hash(doctor.password,8)
    }
    next()
})

const Doctor=mongoose.model('Doctor',doctorSchema)

module.exports=Doctor