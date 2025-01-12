import userModel from "../../DB/Models/user.model.js";
import { rolesType } from "../../Middlewares/auth.middleware.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import { generateToken } from "../../utils/token/token.js";
import { verify } from "../../utils/token/token.js";
import { hash, compare } from "../../utils/hashing/hash.js";
import { encrypt } from "../../utils/encryption/encryption.js";

export const register = async (req, res, next) => {
    const { email, password, phone } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return next(new Error("User already exists", { cause: 400 }));

    const user = await userModel.create({ 
        ...req.body,
        password :hash({ plainText : req.body.password }),
        phone : encrypt({ plainText : req.body.phone, signature : process.env.ENCRYPTION_KEY }),
    });

    emailEmitter.emit("sendEmail", user.email, user.userName);

    res.status(201).json({ message: "User registered successfully", user });
};


export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return next(new Error("User does not exist", { cause: 404 }));
    if (user.confirmEmail === false) return next(new Error("Please verify your email", { cause: 400 }));

    const match = compare({ plainText: req.body.password, hash: user.password });
    if (!match) return next(new Error("password does not match the email", { cause: 400 }));

    // create token
    const token = generateToken({
        payload: { id: user._id, isLoggedIn: true }, 
        signature: 
        user.role === rolesType.User 
            ? process.env.JWT_SECRET_USER 
            : process.env.JWT_SECRET_ADMIN,
        options: { expiresIn: "1d" }
    });
    res.status(200).json({ message: "DONE", token });
};

export const activateAccount = async (req, res, next) => {
    const { token } = req.params;

    const { email } = verify( { token: token, signature: process.env.JWT_SECRET_EMAIL_VERIFICATION});

    const user = await userModel.findOne({email});
    if (!user) return next(new Error("User does not exist", { cause: 404 }));

    user.confirmEmail = true;
    await user.save();

    return res.status(200).json({ message: "Account activated successfully" });
};
