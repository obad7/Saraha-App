import userModel from "../../DB/Models/user.model.js";
import Bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword, phone } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "This email already exists" });
        }
        
        // hash password
        const hashPassword = Bcrypt.hashSync(password, 10);

        // encrypt phone number        
        const encryptPhone = CryptoJS.AES.encrypt(phone, process.env.ENCRYPTION_KEY).toString();

        const user = await userModel.create({ 
            userName, 
            email, 
            password : hashPassword,
            phone : encryptPhone,
        });

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const match = Bcrypt.compareSync(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // create token
        const token = jwt.sign(
            { id: user._id, isLoggedIn: true }, 
            process.env.JWT_SECRET_USER,
            { expiresIn: "1d" }
        );

        // decrypt phone number
        // user.phone = CryptoJS.AES.decrypt(
        // user.phone, 
        // process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

        res.status(201).json({ message: "DONE", token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
};


