const { Schema, model } = require('mongoose');
const {handleMongooseError} = require('../utils')
const Joi = require('joi');

const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
// Адреса містить мінімум один непорожній символ перед символом '@', мінімум один непорожній символ між символами '@' і '.', а також мінімум один непорожній символ після символу '.'. Всі пробіли вважаються неприпустимими. 
const userSchema = new Schema({ 
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
          match: emailRegexp, 
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        avatarUrl: {
          type: String,
          required: true,
        },
        token: String, 
      
}, {versionKey: false, timestamps: true}); 

userSchema.post('save', handleMongooseError); 

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(8).required(),
  });
  
  const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(8).required(),
  });
  
  const schemas = {
    registerSchema,
    loginSchema,
  };
  
  const User = model('user', userSchema);
  
  module.exports = { 
    User, 
    schemas,
};