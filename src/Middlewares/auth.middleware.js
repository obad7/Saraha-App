import userModel from "../DB/Models/user.model.js";
import jwt from 'jsonwebtoken';

export const rolesType = {
    User : "User",
    Admin : "Admin"
}

// Auth Middleware
export const authentication = async (req, res, next) => {
    try {
        // get token from headers
        const { authorization } = req.headers;
        if (!authorization) return next(new Error("Authorization token is required", { cause: 401 }));
        
        const [ Bearer, token] = authorization.split(" ");
        let TOKEN_SIGNITURE = undefined;

        // validate token
        switch (Bearer) {
            case "User":
                TOKEN_SIGNITURE = process.env.JWT_SECRET_USER;
                break;
            case "Admin":
                TOKEN_SIGNITURE = process.env.JWT_SECRET_ADMIN;
                break;
            default:
                return res.status(401).json({ success: false, message: "Unauthorized : Invalid signiture" });
        }

        // distructuring just the {id} from token
        // const { id } = jwt.verify(token, TOKEN_SIGNITURE);
        // or ...
        const decoded = jwt.verify(token, TOKEN_SIGNITURE);
        if (!decoded?.id) return next(new Error("Invalid token", { cause: 401 }));

        const user = await userModel.findById(decoded.id).select("-password");
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