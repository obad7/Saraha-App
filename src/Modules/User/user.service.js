import userModel from "../../DB/Models/user.model.js";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";

export const getUserProfile = async (req, res) => {
    try {
        const { authorization } = req.headers;

        // distructuring just the {id} from token
        const { id } = jwt.verify(authorization, process.env.JWT_SECRET_USER);

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // decrypt phone number
        user.phone = CryptoJS.AES.decrypt(
            user.phone, 
            process.env.ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);

        return res.status(200).json({ success: true,message : "User found successfully", user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
};