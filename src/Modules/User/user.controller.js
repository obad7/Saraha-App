import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
const router = Router();

router.get(
    "/profile",
    authentication,
    allowTo(["User", "Admin"]),
    asyncHandler(userService.getUserProfile)
);


export default router;