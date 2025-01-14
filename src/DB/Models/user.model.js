import mongoose, { Schema } from "mongoose";
import { rolesType } from "../../Middlewares/auth.middleware.js";
import { genderType } from "../../Middlewares/validation.middleware.js";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: [true, "Username is required"],
            trim : true,
            minLength: [3, "Username must be at least 3 characters"],
            maxLength: [20, "Username must be at most 20 characters"],
        },

        email: {    
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email must be unique"],
            trim : true,
            lowercase: true,
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            ]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        gender: {
            type: String,
            enum: Object.values(genderType),
            default: genderType.male
        },

        confirmEmail: {
            type: Boolean,
            default: false
        },

        role: {
            type: String,
            enum: Object.values(rolesType),
            default: rolesType.User
        },
        
        isDeleted: {
            type: Boolean,
            default: false
        },

        DOB: String,
        address: String,
        phone: String,
        image: String,
        changedAt: Date,
    },


    { 
        timestamps: true 
    }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;