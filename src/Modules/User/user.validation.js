import joi from "joi";
import { validateObjectId, generalFields } from "../../Middlewares/validation.middleware.js";

export const updateProfileSchema = joi.object({
    userName: generalFields.userName,
    email: generalFields.email,
    phone: generalFields.phone,
    gender: generalFields.gender,
}).required();

export const changePasswordSchema = joi.object({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.not(joi.ref("oldPassword")).required(),
    confirmPassword: generalFields.confirmPassword.required(),
}).required();