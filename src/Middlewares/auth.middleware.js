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
        if (!authorization) {
            return res.status(401).json({ success: false, message: "Unauthorized : No token provided" });
        }
        
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
        if (!decoded?.id) {
            return res.status(401).json({ success: false, message: "Invalid payload" });
        }

        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }
        // attach user to the request object
        req.user = user;

        return next();
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
};

// check user role - Authorization Middleware
export const allowTo = (roles = []) => {
    return async (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ success: false, message: "Forbidden Account" });
            }
            return next();
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message, stack: error.stack });
        }
    }
}