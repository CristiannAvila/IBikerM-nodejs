const nodemailer = require("nodemailer");
const mail = require('../config/mail.config')

const sendEmailReset = async (correo, subject, text) => {
	try {
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
            },
		});

		await transporter.sendMail({
            from: `IbikersM <${ mail.user }>`,// sender address
            to: correo, // list of receivers
            subject: subject, // Subject lin// plain text body
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};

module.exports ={
    sendEmailReset
}