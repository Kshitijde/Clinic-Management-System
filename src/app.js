const express=require('express')
require('./db/mongoose')
const doctorRouter=require('./routers/doctor')

const app=express()

app.use(express.json())
app.use(doctorRouter)
 
module.exports=app