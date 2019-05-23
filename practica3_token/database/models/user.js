const mongoose=require('../connect');
const Schema=mongoose.Schema;

const user=Schema({
  nombre:String,
  email:String,
  password:String
});

const usermodel=mongoose.model('users',user);

module.exports=usermodel;
