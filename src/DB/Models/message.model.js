import mongoose, { Schema, Types, model } from "mongoose";

const messageSchema = new Schema (
    {
        content : {
            type : String,
            required : true
        },

        sender : {
            type : Types.ObjectId,
            ref : "User",
            required : true
        },

        receiver : {
            type : Types.ObjectId,
            ref : "User",
            required : true
        }  
    },
    
    { timestamps : true }
);

const MessageModel = mongoose.models.Message || model("message", messageSchema);

export default MessageModel;