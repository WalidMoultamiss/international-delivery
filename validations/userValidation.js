
const Joi = require("@hapi/joi");


//Register validation
const registerValidation = (data)=>{
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        fullName: Joi.string().min(6).max(255).required(),
        role: Joi.string()
        .min(4)
        .max(255)
        .required()
        .valid("admin", "user", "moderator", "editor"),
    });

    return schema.validate(data);
}

//Login validation
const loginValidation = (data)=>{
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required()
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;