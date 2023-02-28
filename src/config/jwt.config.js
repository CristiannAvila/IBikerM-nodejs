const jwt = require('jsonwebtoken');
const user = require('../models/user');


const getToken = (payload) => {
    return jwt.sign({
        data: payload
    }, 'SECRET');
}

const getTokenReset = (payload) => {
    return jwt.sign({
        data: payload
    }, 'SECRET', 
    {correo: user.correo,
    _id: user._id}, 
    {expiresIn: '15m'});
}
const getTokenData = (token) => {
    let data = null;
    jwt.verify(token, 'SECRET', (err, decoded) =>{
        if (err) {
            console.log('Error al obtener data del token');
        }else{
            data = decoded;
        }
    });

    return data;
}
const getTokenDataReset = (token) => {
    let data = null;
    jwt.verify(token, 'SECRET', (err, decoded) =>{
        if (err) {
            console.log('Error al obtener data del token');
        }else{
            data = decoded;
        }
    });

    return data;
}
module.exports = {
    getToken,
    getTokenData,
    getTokenReset
}