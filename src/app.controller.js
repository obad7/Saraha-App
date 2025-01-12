import connectDB from "./DB/connection.js";
import authController from "./Modules/Auth/auth.controller.js";
import userController from "./Modules/User/user.controller.js";
import messageController from "./Modules/Messages/message.controller.js";
import globalErrorHandler from "./utils/error handling/globalErrorHandler.js";

const bootstrap = async (app, express) => {
    connectDB();
    app.use(express.json());

    // auth routes
    app.use("/auth", authController);

    // user routes
    app.use("/user", userController);

    // message routes
    app.use("/message", messageController);

    // 404
    app.all("*", (req, res, next) => {
        return next(new Error("Route not found", { cause: 404 }));
    });

    // global error handler
    app.use(globalErrorHandler);

}

export default bootstrap;