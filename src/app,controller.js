import connectDB from "./DB/connection.js";
import authController from "./Modules/Auth/auth.controller.js";
import userController from "./Modules/User/user.controller.js";
import messageController from "./Modules/Messages/message.controller.js";

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
    app.all("*", (req, res) => {
        res.status(404).json({ message: "Route not found" });
    });

}

export default bootstrap;