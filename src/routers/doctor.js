const express=require('express')
const multer=require('multer')
const sharp=require('sharp')
const auth=require('../middleware/auth')
const {sendWelcomeEmail, sendCancelEmail}=require('../emails/account')
const Doctor = require('../models/doctor')
const router=new express.Router()

router.post('/register',async(req,res)=>{
    const doctor=new Doctor(req.body)
    try{
        await doctor.save()
        // sendWelcomeEmail(doctor.email,doctor.name)
        const token=await doctor.generateAuthToken()  
        res.status(201).send({doctor,token})
    }catch(e){
        res.status(400).send(e)
    }
})


router.post('/doctors/login',async(req,res)=>{
    try{
        const doctor=await Doctor.findByCredentials(req.body.email,req.body.password)
        const token=await doctor.generateAuthToken()
        res.send({doctor,token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/doctors/logout',auth,async(req,res)=>{
    try{
        req.doctor.tokens=req.doctor.tokens.filter((token)=>{
            return token.token !=req.token
        })  
        await req.doctor.save()

        res.send()
    }catch(e){
        res.status(500).send()

    }
})

router.post('/doctors/logoutAll',auth,async(req,res)=>{
    try{
        req.doctor.tokens=[]
        await req.doctor.save()
        res.send()
    }
    catch(e){
        res.status(500).send()

    }
})

router.get('/doctors/me',auth,async(req,res)=>{
    res.send(req.doctor)
})

router.patch('/doctors/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'invalid updates!'})
    }


    try{
        // const doctor=await Doctor.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

        // const doctor=await Doctor.findById(req.params.id)

        updates.forEach((update)=>req.doctor[update]=req.body[update])

        await req.doctor.save()
        res.send(req.doctor)
    }catch(e){
        res.status(400).send(e)
    }
})


router.delete('/doctors/me',auth,async(req,res)=>{
    try{
        // const doctor=await Doctor.findByIdAndDelete(req.doctor._id)

        // if(!doctor){
        //     return res.status(404).send()
        // }
        await req.doctor.remove()
        // sendCancelEmail(req.doctor.email,req.doctor.name)
        res.send(req.doctor)
    }catch(e){
        res.status(500).send()
    }
})


const upload=multer({limits:{fileSize:1000000},fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
        return cb(new Error('Enter an image please!'))
    }
    cb(undefined,true)
}
})
router.post('/doctors/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.doctor.avatar=buffer
    await req.doctor.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/doctors/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    req.doctor.avatar=undefined
    await req.doctor.save()
    res.send()
})

router.get('/doctors/:id/avatar',async(req,res)=>{
    try{
        const doctor=await Doctor.findById(req.params.id)
        if(!doctor || !doctor.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
        
    }catch(e){
        res.status(404).send()
    }
})

module.exports=router