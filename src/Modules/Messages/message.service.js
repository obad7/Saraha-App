import MessageModel from './../../DB/Models/message.model.js';
import UserModel from './../../DB/Models/user.model.js';
import { flags } from "./message.validation.js";

export const sendMessage = async (req, res, next) => {
    const  {content , receiver} = req.body

    const user = await UserModel.findById(receiver);
    if (!user) return next(new Error("User does not exist", { cause: 404 }));

    const message = await MessageModel.create({ 
        content,
        receiver,
        sender: req.user._id
    });

    return res
        .status(200).json({ 
            success: true, 
            message: "Message sent successfully",
            result : message
        });
}

export const getSingleMessage = async (req, res, next) => {
    const { messageId } = req.params
    const { user } =  req;
    const message = await MessageModel.findById(messageId).populate([
        { path: "sender", select: "userName email -_id"},
        { path: "receiver", select: "userName email -_id"},
    ]);

    if (
        message.receiver?.email === user.email ||
        message.sender?.email === user.email
    )
    return res.status(200).json({ success: true, result : message });

    return next(new Error("Unauthorized", { cause: 403 }));
}

export const getAllMessages = async (req, res, next) => {
    const { flag } = req.query;

    return res.status(200).json({
        success: true, 
        results: 
            flag == flags.inbox 
                ? await MessageModel.find({ receiver: req.user._id }) 
                : await MessageModel.find({ sender: req.user._id })
    });
}

export const updateMessage = async (req, res, next) => {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await MessageModel.findById(messageId);
    if (!message) return next(new Error("Message does not exist", { cause: 404 }));

    if (message.sender.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized", { cause: 403 }));
    }

    message.content = content;
    await message.save();

    return res.status(200).json({
        success: true,
        message: "Message updated successfully",
        result: message,
    });
}

export const deleteMessage = async (req, res, next) => {
    const { messageId } = req.params;

    const message = await MessageModel.findById(messageId);
    if (!message) return next(new Error("Message does not exist", { cause: 404 }));

    if (
        message.sender.toString() !== req.user._id.toString() &&
        message.receiver.toString() !== req.user._id.toString()
    ) {
        return next(new Error("Unauthorized", { cause: 403 }));
    }

    await MessageModel.deleteOne({ _id: messageId });

    return res.status(200).json({
        success: true,
        message: "Message deleted successfully",
    });
}