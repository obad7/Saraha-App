import userModel from "../../DB/Models/user.model.js";
import Bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { rolesType } from "../../Middlewares/auth.middleware.js";
import { emailEmitter } from "../../utils/emailEvents.js";

export const register = async (req, res, next) => {
    const { email, password, phone } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return next(new Error("User already exists", { cause: 400 }));

    // hash password
    const hashPassword = Bcrypt.hashSync(password, 10);

    // encrypt phone number     
    const encryptPhone = CryptoJS.AES.encrypt(phone, process.env.ENCRYPTION_KEY).toString();

    const user = await userModel.create({ 
        ...req.body,
        password : hashPassword,
        phone : encryptPhone,
    });

    emailEmitter.emit("sendEmail", user.email, user.userName);

    res.status(201).json({ message: "User registered successfully", user });
};


export const login = async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return next(new Error("User does not exist", { cause: 404 }));
    if (user.confirmEmail === false) return next(new Error("Please verify your email", { cause: 400 }));

    const match = Bcrypt.compareSync(password, user.password);
    if (!match) return next(new Error("password does not match the email", { cause: 400 }));

    // create token
    const token = jwt.sign(
        { id: user._id, isLoggedIn: true }, 
        user.role === rolesType.User
            ? process.env.JWT_SECRET_USER 
            : process.env.JWT_SECRET_ADMIN,
        { 
            expiresIn: "1d"
        }
    );
    res.status(201).json({ message: "DONE", token });
};

export const activateAccount = async (req, res, next) => {
    const { token } = req.params;

    const { email } = jwt.verify(token, process.env.JWT_SECRET_EMAIL_VERIFICATION);

    const user = await userModel.findOne({ email });
    if (!user) return next(new Error("User does not exist", { cause: 404 }));

    user.confirmEmail = true;
    await user.save();

    return res.status(200).json({ message: "Account activated successfully" });
};
