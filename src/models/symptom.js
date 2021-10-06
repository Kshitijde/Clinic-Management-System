const mongoose=require('mongoose')


const symptomSchema=new mongoose.Schema({
    description:{

        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Doctor"

    }
},{
    timestamps:true
})
const Symptom=mongoose.model('Symptom',symptomSchema)
module.exports=Symptom