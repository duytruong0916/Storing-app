const mongoose = require('mongoose');
const validators = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    lastname: {type: String, require: true},
    firstname: {type: String, require: true},
    password: {type:String, require:true},
    email: {type:String, require:true, unique:true},
});
userSchema.plugin(validators);
const User = module.exports = mongoose.model('User', userSchema);
module.exports.getUserbyID = function(id, callback){
    User.findById(id, callback);
}
module.exports.findUser = function(email, callback){
    let query = {email: email};
    User.findOne(query, callback);
}
module.exports.RegisterUser = function(newuser, callback){
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newuser.password, salt, (err,hash)=>{
            if(err) console.log(err);
            newuser.password = hash;
            newuser.save(callback);
        });
    })
}
module.exports.comparePassword = function(userpassword, hash, callback){
    bcrypt.compare(userpassword, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    })

}
