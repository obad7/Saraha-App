import userModel from "../DB/Models/user.model.js";
import jwt from 'jsonwebtoken';
export const authentication = async (req, res, next) => {
    try {
        // get token from header
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ success: false, message: "Unauthorized : No token provided" });
        }

        // distructuring just the {id} from token
        const { id } = jwt.verify(authorization, process.env.JWT_SECRET_USER);

        const user = await userModel.findById(id);
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