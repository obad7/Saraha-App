import userModel from "../DB/Models/user.model.js";
import { verify } from "../utils/token/token.js";
import joi from 'joi';

export const rolesType = {
    User : "User",
    Admin : "Admin"
}

export const genderType = {
    male: "male",
    female: "female"
}

// Auth Middleware
export const authentication = async (req, res, next) => {
    try {
        // get token from headers
        const { authorization } = req.headers;
        if (!authorization) return next(new Error("Authorization token is required", { cause: 401 }));
        
        const [ Bearer, token] = authorization.split(" ");
        let TOKEN_SIGNITURE = undefined;

        switch (Bearer) {
            case "Bearer":
                TOKEN_SIGNITURE = process.env.JWT_SECRET_USER;
                break;
            case "Admin":
                TOKEN_SIGNITURE = process.env.JWT_SECRET_ADMIN;
                break;
            default:
                break;
        }

        const decoded = verify({ token: token, signature: TOKEN_SIGNITURE});
        if (!decoded?.id) return next(new Error("Invalid token", { cause: 401 }));

        const user = await userModel.findById(decoded.id);
        if (!user) return next(new Error("User does not exist", { cause: 404 }));

        // attach user to the request object
        req.user = user;

        return next();
    } catch (error) {
        return next(error);
    }
};

// check user role - Authorization Middleware
export const allowTo = (roles = []) => {
    return async (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) 
                return next(new Error("You are not authorized to perform this action", { cause: 403 }));
            return next();
        } catch (error) {
            return next(error);
        }
    }
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