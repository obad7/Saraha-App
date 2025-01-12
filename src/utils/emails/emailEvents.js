import  { EventEmitter } from "events"
import jwt from "jsonwebtoken";
import sendEmail, { subject } from "./sendEmail.js";
import { signUpHTML } from "./generateHTML.js";
import { generateToken } from "../token/token.js";

export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async(email, userName) => {
    // create email verification token
    const emailVerificationToken = generateToken({
        payload: { email }, 
        signature: process.env.JWT_SECRET_EMAIL_VERIFICATION,
    })
    
    // create email verification link
    const emailVerificationLink = `http://localhost:3000/auth/activate_account/${emailVerificationToken}`;

    const isSent = await sendEmail(
        email,
        subject.verifyEmail,
        signUpHTML(emailVerificationLink, userName)
    );

    // if (!isSent) return next(new Error("Failed to send email", { cause: 500 }));
});
