const Joi = require("@hapi/joi");

//livraison validation
const livraisonValidation = (data) => {
  const schema = Joi.object({
    dateLivraison: Joi.string().min(6).max(255).required(),
    kg: Joi.string().min(1).max(255).required(),
    direction: Joi.string().min(4).max(255).required().valid("Europe", "Afrique", "Asie", "Amerique", "Australie", "Nationale"),
    from: Joi.string().min(2).max(255).required(),
    to: Joi.string().min(2).max(255).required(),
  });

  return schema.validate(data);
};

module.exports.livraisonValidation = livraisonValidation;
