import userModel from "../../DB/Models/user.model.js";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";

export const getUserProfile = async (req, res) => {
    try {
        // get user from request
        const { user } = req;

        // decrypt phone number
        user.phone = CryptoJS.AES.decrypt(
            user.phone, 
            process.env.ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);

        return res.status(200).json({ success: true,message : "User found successfully", result : user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
};