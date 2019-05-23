const User=require('../database/models/user');
const express=require('express');
const autenticacion=require('./checkAuth');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const rout=express.Router();

rout.get('/',autenticacion,(req,res,next)=>{
    User.find().exec().then(result=>{
      if(result.length>0){
        res.status(200).json(result);
      }else{
        res.status(200).json({
          message:"no existen usuarios en la bd"
        });
      }
    }).catch(err=>{
      res.status(500).json({
        message:err
      });
    });
});


rout.post('/',(req,res,next)=>{
    const datos={
      nombre:req.body.nombre,
      email:req.body.email
    };
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(hash){
          datos.password=hash;
          const insertar=new User(datos);
          insertar.save().then(()=>{
            res.status(200).json({
              message:"usuario insertado en la bd"
            });
          }).catch(err=>{
            res.status(500).json({
              message:err
            });
          });
        }else{
          res.status(500).json({
            message:err
          });
        }
    });
});

rout.post('/login',function(req,res,next){
    User.find({
      email:req.body.email
    }).exec().then(user=>{
        if(user.length>0){
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(result){
                  const token=jwt.sign({
                    email:user[0].email,
                    id:user[0]._id
                  },process.env.JWT_KEY||'miClave',{
                    expiresIn:"2h"
                  });

                  res.status(200).json({
                    message:"auth successfull",
                    token:token
                  });
                }else{
                  res.status(401).json({
                    message:"auth failed 1"
                  });
                }
            });
        }else{
          res.status(401).json({
            message:"auth failed 2"
          });
        }
    }).catch(err=>{
      res.status(500).json({
        message:err
      });
    });
});

module.exports=rout;
