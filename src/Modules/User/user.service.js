import { decrypt } from "../../utils/encryption/encryption.js";

export const getUserProfile = async (req, res, next) => {
    // get user from request
    const { user } = req;

    // decrypt phone number
    user.phone = decrypt({ 
        encrypted : user.phone, 
        signature : process.env.ENCRYPTION_KEY 
    })
    return res.status(200).json({ success: true,message : "User found successfully", result : user });
};