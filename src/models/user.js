const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    nombre:{type:String, required:true},
    apellido:{type:String, required:true},
    tipoDocumento:{type:String, required:true},
    numeroDocumento:{type:String, unique:true, required:true},
    telefono:{type:String, required:true},
    correo:{type:String, unique:true, required:true},
    password:{type: String, require: true},
    code:{type: String, required:true},
    status:{type: String, required:true, default: 'UNVERIFIED'},
    rol:{type: String, required:true, enum: ['administrador', 'cliente'], default: 'cliente'},
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Number, default: null},
});

UserSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
       const document = this;
        bcrypt.hash(document.password, 10,(err, hashedPassword)=>{
           if(err){
                next(err);
            }else{
            document.password = hashedPassword;
               next();
            }
        });
    }else{
        next();
   }
})

UserSchema.methods.isCorrectPassword = function(password,callback){
    bcrypt.compare(password, this.password, function(err, isMatch){
        if(err){
            callback(err);
        }else{
            callback(null ,isMatch);
        }
    });
}


module.exports = mongoose.model('User', UserSchema); 
