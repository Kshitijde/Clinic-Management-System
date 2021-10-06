const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'kshitij.deshpande7@gmail.com',
        subject:"thanks for joining in!",
        text:`Welcome to the app, ${name}. Let me know how you get along with the app!`
    })
}

const sendCancelEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'kshitij.deshpande7@gmail.com',
        subject:'Thanks for using our services!',
        text:`Goodbye ${name}!Is there anything else we could have done to keep you?!`

    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}