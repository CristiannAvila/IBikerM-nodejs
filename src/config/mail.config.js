const nodemailer =require('nodemailer');
const Mail = require('nodemailer/lib/mailer');
const {correo} = require('../models/user')

const mail = {
  user: 'ibikersm@gmail.com',
  pass: 'fjpjntzivgclfvsi'
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    tls: {
      rejectUnauthorized: false
    },
    secure: true, // true for 465, false for other ports
    auth: {
      user: mail.user, // generated ethereal user
      pass: mail.pass, // generated ethereal password
    }
  });

  const sendEmail = async (correo, subject, html) =>{
    try {
        await transporter.sendMail({
            from: `IbikersM <${ mail.user }>`,// sender address
            to: correo, // list of receivers
            subject, // Subject line
            text: "Holaxd", // plain text body
            html, // html body
        });
    } catch (error) {
        console.log('Algo no va bien con el email', error)
    }
  }

  const getTemplate = (nombre, apellido, token) =>{
    return `
        <head> 
        </head>

        <div id="email_content">
            <img src="" alt="">
            <h2>Hola ${ nombre} ${apellido}</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a href="http://localhost:7000/confirm/${ token }">Confirmar cuenta</a>
        </div>
    `;
  }
  const getTemplatereset = (nombre, apellido, token, user, _Id) =>{
    return `
        <head> 
        </head>

        <div id="email_content">
            <img src="" alt="">
            <h2>Hola ${ nombre} ${apellido}</h2>
            <p>Para restaurar tu contraseña, has click en el siguiente enlace: </p>
            <a href="">Restaurar Contraseña</a>
        </div>
    `;
  }

module.exports ={
    sendEmail,
    getTemplate,
    getTemplatereset
}