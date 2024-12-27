import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
const router = Router();

router.get(
    "/profile",
    authentication,
    allowTo(["User"]),
    userService.getUserProfile,
);


export default router;