
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    // auth: {
    //     user: 'peyton.blick13@ethereal.email',
    //     pass: 'CkjYyKbC6qpRyKckcx'
    // }
    service : 'gmail',
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth: {
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
});

const sendEmail = async (url , email) => transporter.sendMail({
    from :process.env.EMAIL,
    to: email,
    subject: 'Verify your account',
    html: `Click <a href = '${url}'> ${url} </a> to confirm your email.`
  })

export {sendEmail} 