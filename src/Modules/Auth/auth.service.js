import userModel from "../../DB/Models/user.model.js";

export const register = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "This email already exists" });
        }

        const user = await userModel.create({ userName, email, password });

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

        res.status(201).json({ message: "DONE", user });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
};


