const mongoose=require('mongoose')
// const validator=require('validator')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})

// const User=mongoose.model('User',{
//     name:{

//         type:String,
//         required:true,
//         trim:true
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true,
//         lowercase:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error("email is invalid")
//             }
//         }
//     },
//     password:{
//         type:String,
//         trim:true,
//         minlength:7,
//         validate(value){
//             // value.toLowerCase()==='password'
//             if(value.toLowerCase().includes('password')){
//                 throw new Error("this password is not allowed")
//             }
//         }
//     },
//     age:{
//         type:Number,
//         default:0,
//         validate(value){
//             if(value<0){
//                 throw new Error("negative number is not allowed.")
//             }
//         }
//     }
// })

// const me=new User({
//     name:' baba  ',
//     email:'mike@gmail.com  ',
//     password:'phone@123!'
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error:",error)
// })

// const Task=mongoose.model('Task',{
//     description:{

//         type:String,
//         required:true,
//         trim:true
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })

// const task=new Task({description:"  Trying this with sanitization and validation"})

// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error)
// })
