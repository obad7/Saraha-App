import { Types } from "mongoose";
export const validation = (schema) =>{
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        const results = schema.validate(data, { abortEarly: false });
        if (results.error) {
            const errorMessage = results.error.details.map((obj) => obj.message);
            return next(new Error(errorMessage, { cause: 400 }));
        }

        return next();
    };
};

export const validateObjectId = (value, helper) => {
    if(Types.ObjectId.isValid(value)) return true;
    return helper.message("Receiver must be a valid object id");
}
