import joi from 'joi';
import { generalFields } from '../../Middlewares/validation.middleware.js';

export const registerSchema = joi.object({ 
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.required(),
    phone: generalFields.phone.required(),
    role: generalFields.role,
    gender: generalFields.gender,
    id: generalFields.id,
}).required();

export const loginSchema = joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
}).required();