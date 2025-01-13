import joi from "joi";
import { validateObjectId } from "../../Middlewares/validation.middleware.js";

export const messageSchema = joi.object({
    content: joi.string().required(),
    receiver: joi.custom(validateObjectId).required(),
}).required();

export const getSingleMessageSchema = joi.object({
    messageId: joi.custom(validateObjectId).required(),
}).required();

export const flags = {
    inbox: "inbox",
    outbox: "outbox",
}

export const getAllMessagesSchema = joi.object({
    flag: joi.string().valid(...Object.values(flags)).required(),
}).required();

export const updateMessageSchema = joi.object({
    messageId: joi.custom(validateObjectId).required(),
    content: joi.string().required(),
}).required();

export const deleteMessageSchema = joi.object({
    messageId: joi.custom(validateObjectId).required(),
})