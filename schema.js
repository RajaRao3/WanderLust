const Joi = require('joi');
const schemaValidator = Joi.object({
    title:Joi.string().required(),
    description:Joi.string()
              .required(),
      image: Joi.string()
              .optional(),
    price:Joi.number()
          .min(0)
         .required(),
    location:Joi.string()
               .required(),
    country:Joi.string()
            .required()
      
})

const reviewValidator = Joi.object({
      rating:Joi.number()
              .required(),
  
      comment:Joi.string()
               .required(),
      
})

module.exports = {
      schemaValidator,
      reviewValidator
  };
  
