import UserModel from "../../DB/Models/user.model.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { compare, hash } from "../../utils/hashing/hash.js";

export const getUserProfile = async (req, res, next) => {
    // distruct user from request
    const { user } = req;

    // decrypt phone number
    user.phone = decrypt({ 
        encrypted : user.phone, 
        signature : process.env.ENCRYPTION_KEY 
    })
    return res.status(200).json({ success: true,message : "User found successfully", result : user });
};

export const updateProfile = async (req, res, next) => {
    const { user } = req;

    if(req.body.phone) {
        req.body.phone = encrypt({ 
            plainText : req.body.phone, 
            signature : process.env.ENCRYPTION_KEY 
        });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        user._id, 
        { ...req.body }, 
        { new: true , runValidators: true }
    );

    return res.status(200).json({ success: true, message: "User updated successfully", result: updatedUser });
};

export const changePassword = async (req, res, next) => {
    const { user } = req;
    const { oldPassword, password } = req.body;

    const compareHash = compare({ plainText: oldPassword, hash: user.password });
    if (!compareHash) return next(new Error("Old password is incorrect", { cause: 400 }));

    const hashPassword = hash({ plainText: password });
    
    const updatedUser = await UserModel.findByIdAndUpdate(
        user._id, 
        {   
            password: hashPassword,
            changedAt: Date.now(),
        }, 
        { new: true, runValidators: true }
    );

    return res.status(200).json({ 
        success: true, 
        message: "Password updated successfully", 
        result: updatedUser 
    });
};

export const diactivateAccount = async (req, res, next) => {
    const { user } = req;

    const updatedUser = await UserModel.findByIdAndUpdate(
        user._id, 
        { isDeleted: true, changedAt: Date.now() },
        { new: true, runValidators: true }
    );

    return res.status(200).json({ 
        success: true, 
        message: "Account diactivated successfully", 
    });
};