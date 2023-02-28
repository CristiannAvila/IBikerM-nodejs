const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./src/models/user');
const { getTokenReset } = require('./src/config/jwt.config');

const PORT = process.env.PORT || 7000;

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const { correoUser } = require('./src/config/config');
const user = require('./src/models/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./src/routes/user.routes'));


const mongo_uri = 'mongodb+srv://CamiloM:123456789IBM@cluster0.xfweo6z.mongodb.net/IBikerM?retryWrites=true&w=majority';

mongoose.connect(mongo_uri, function(err){
    if(err){
        throw err;
    }else{
        console.log(`Successfully connected to ${mongo_uri}`);
    }
});

app.post('/forgot-password' , async (req, res) =>{
    const {correo, _id} = req.body
    let user =  await User.findOne({ correo }) || null;
    if (user === null) {
        return res.json({
            success: false,
            msg: 'Usuario no existe'
        });
    }
    const payload ={
        correo: user.correo,
        _id: user._id
    }
    const token = jwt.sign(payload, 'secret', {expiresIn: '15m'})
    const link = `http://localhost:7000/reset-password/${user._id}/${ token}`
    console.log(link)
    res.send(link)
    
});

app.get('/reset-password/:token', (req, res) => {
    const filter = { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } };
  
    User.findOne(filter, function(err, user) {
      if (!user) {
        req.flash('error', 'El token de restablecimiento de contraseña es inválido o ha expirado.');
        return res.redirect('/forgot-password');
      }
  
      res.render('reset-password', { token: req.params.token });
    });
  });
  
  app.post('/reset-password/:token', (req, res) => {
    const filter = { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } };
  
    User.findOne(filter, function(err, user) {
      if (!user) {
        req.flash('error', 'El token de restablecimiento de contraseña es inválido o ha expirado.');
        return res.redirect('/forgot-password');
      }
  
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) throw err;
  
        user.password = hash;
  
        collection.updateOne({ _id: user._id }, { $set: user }, function(err, result) {
          console.log(`Se actualizó el documento del usuario: ${result.modifiedCount}`);
  
          req.logIn(user, function(err) {
            res.redirect('/dashboard');
          });
        });
      });
    });
  });
  
  app.get('/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
  
  app.post('/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
  

app.listen(PORT, ()=>{
    console.log(`Run in -p ${ PORT }`);
})
module.exports=app;
















