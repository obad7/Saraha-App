import { Types } from "mongoose";
import joi from "joi";
import { rolesType } from "./auth.middleware.js";

export const genderType = {
    male: "male",
    female: "female"
}

export const validation = (schema) =>{
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        const results = schema.validate(data, { abortEarly: false });
        if (results.error) {
            const errorMessage = results.error.details.map((obj) => obj.message);
            return next(new Error(errorMessage, { cause: 400 }));
        }

        return next();
    };
};

export const validateObjectId = (value, helper) => {
    if(Types.ObjectId.isValid(value)) return true;
    return helper.message("Receiver must be a valid object id");
}


export const generalFields = {
    userName: joi.string().min(3).max(20),
    email: joi.string().email(),
    password: joi.string(),
    confirmPassword: joi.string().valid(joi.ref("password")),
    phone: joi.string(),
    role: joi.string().valid(...Object.values(rolesType)),
    gender: joi.string().valid(...Object.values(genderType)),
    ///////////////////////////////////////
    id : joi.custom(( value, helper ) => { 
        if ( value > 20 ) return true;
        return helper.message("Id must be less than 20");
    })
}