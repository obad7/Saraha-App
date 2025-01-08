import { Router } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = Router();

router.post("/register", asyncHandler(authService.register));
router.post("/login", asyncHandler(authService.login));

router.get("/activate_account/:token", asyncHandler(authService.activateAccount));

export default router;