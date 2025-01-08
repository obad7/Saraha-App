import joi from 'joi';
import { rolesType } from '../../Middlewares/auth.middleware.js';

export const registerSchema = joi.object({
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    phone: joi.string(),
    role: joi.string().valid(...Object.values(rolesType)),
}).required();

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
}).required();