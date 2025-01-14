import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as userValidation from "./user.validation.js";
import { validation } from "../../Middlewares/validation.middleware.js";
const router = Router();

router.get(
    "/profile",
    authentication,
    allowTo(["User", "Admin"]),
    asyncHandler(userService.getUserProfile)
);

router.patch(
    "/",
    authentication,
    allowTo(["User", "Admin"]),
    validation(userValidation.updateProfileSchema),
    asyncHandler(userService.updateProfile)
);

router.patch(
    "/change-password",
    authentication,
    allowTo(["User", "Admin"]),
    validation(userValidation.changePasswordSchema),
    asyncHandler(userService.changePassword)
);

router.delete(
    "/diactivate-account",
    authentication,
    allowTo(["User", "Admin"]),
    asyncHandler(userService.diactivateAccount)
);


export default router;