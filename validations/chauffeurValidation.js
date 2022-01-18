const Joi = require("@hapi/joi");

//chauffeur validation
const chauffeurValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(6).max(255).required(),
    CIN: Joi.string().min(6).max(8).required(),
    permis: Joi.string().min(6).max(8).required(),
    truck: Joi.string()
      .min(4)
      .max(255)
      .required()
      .valid("voiture", "miniCamion", "camion"),
  });

  return schema.validate(data);
};

const assignValidation = (data) => {
    const schema = Joi.object({
        livraisonId: Joi.string().min(6).max(255).required(),
        chauffeurId: Joi.string().min(6).max(255).required(),
    });

    return schema.validate(data);
};

module.exports.chauffeurValidation = chauffeurValidation;
module.exports.assignValidation = assignValidation;
