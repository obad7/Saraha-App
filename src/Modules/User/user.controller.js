import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../Middlewares/auth.middleware.js";
const router = Router();

router.get("/profile", authentication ,userService.getUserProfile);


export default router;