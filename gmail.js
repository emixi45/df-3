
require('dotenv').config()

const {createTransport} =require('nodemailer')
const ejs = require('ejs')
const mail = process.env.CORREO
const PASS = process.env.PASS
const mail_to =process.argv[2] || process.env.CORREO

const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: mail,
        pass: PASS
    }
})

const data = 'datos de compra'

ejs.renderFile('views/compra.ejs',{data})
    .then(body => {
        transporter.sendMail({
            from: mail,
            to: [mail_to],
            subject: 'Datos de compra',
            html: body,
        })
            .then(r => console.log(r))
            .catch(e => console.log ('error',e))
    })

