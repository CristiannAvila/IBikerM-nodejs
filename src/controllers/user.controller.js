const User = require('../models/user');
const jwt = require('jsonwebtoken')
const config =require('../config/config')
const { v4: uuidv4 } = require('uuid');
const { getToken, getTokenData} = require('../config/jwt.config');
const { getTemplate, sendEmail } = require('../config/mail.config');
const { router } = require('../../app');
const bcrypt = require('bcrypt');
const crypto = require("crypto");

const { models } = require('mongoose');
   
const singUp  = async (req, res) =>{
    try {
         // Obtener la data del usuario 
        const {nombre, apellido, tipoDocumento, numeroDocumento, telefono, correo, password, rol} = req.body;

        //verificar que el usuario no existe 
        let user = await User.findOne({ correo }) || null;
    
        if (user !== null) {
            return res.json({
                success: false,
                msg: 'Usuario ya existe'
            });
        }

        //generar el codigo
        const code = uuidv4();

        //generar un nuevo usuario
        user = new User({nombre, apellido, tipoDocumento, numeroDocumento, telefono, correo, password, code, rol})

        //generar token
        const token = getToken({correo, code});

        //Obtener un template
        const template = getTemplate(nombre,apellido, token);

        //enviar el email
        await sendEmail(correo, 'Verifica el email acá', template);
        await user.save();

        return res.redirect('/autentificacion.html'); 
    }catch (error) {
        console.log(error);
        return res.json({
            success: false,
            msg: 'Error al registar usuario'
        });
    }
}
    const confirmar = async (req, res) => {
        try {
    
           // Obtener el token
           const { token } = req.params;
           
           // Verificar la data
           const data = await getTokenData(token);
    
           if(data === null) {
                return res.json({
                    success: false,
                    msg: 'Error al obtener data'
                });
           }
    
           console.log(data);
    
           const { correo, code } = data.data;
    
           // Verificar existencia del usuario
           const user = await User.findOne({ correo }) || null;
    
           if(user === null) {
                return res.json({
                    success: false,
                    msg: 'Usuario no existe'
                });
           }
    
           // Verificar el código
           if(code !== user.code) {
                return res.redirect('/error.html');
           }
    
           // Actualizar usuario
           user.status = 'VERIFIED';
           await user.save();
    
           // Redireccionar a la confirmación
           return res.redirect('/confirm.html');
            
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                msg: 'Error al confirmar usuario'
            });
        }
    }

 const singIn = async (req, res) =>{

    const {correo, password} = req.body;

    User.findOne({correo}, (err,user) =>{
        if(err){
            res.status(500).send('Error al autentificar el usuario')
        }else if(!user){
            res.status(500).send('Usuario Y/O contraseña incorrecta')
        }else{
            user.isCorrectPassword(password,(err, result, isMatch)=>{
                if(err){
                }else if(result){
                    if (user.status==="VERIFIED") {
                        return res.redirect('/index.html');
                    } else {
                        res.status(500).send('Su cuenta aún esta sin verificar')
                    }
            
                }else{
                    res.status(500).send('Usuario Y/O contraseña incorrecta')
                }
            });
        }
    });
 }
 

 const forgotpassword = async (req, res) => {
	try {
        const {correo,nombre,apellido, _id} = req.body;
        //
		let user = await User.findOne({correo});
		console.log(correo)
		if (!user)
			return res
				.status(409)
				.send({ message: "User with given email does not exist!" });

	    const token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token:  crypto.randomBytes(32).toString("hex"),
			}).save();
		}
        
		const template = `http://localhost:7000/password-reset/${user._id}/${token.token}`

		await sendEmail(correo, "Password Reset", template);

		res
			.status(200)
			.send({ message: "Password reset link sent to your email account" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
        console.log(error)
	}
};

const resetpassword = async (req, res) => {
	try {
		const user = await User.findById({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });
        
		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		user.password = hashPassword;
		await user.save();
		await token.delete();

		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
};
module.exports = {
    singUp,
    confirmar,
    singIn, 
    forgotpassword,
    resetpassword,
} 