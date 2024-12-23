import { Router } from "express";
import * as authService from "./auth.service.js";
const router = Router();

router.post("/register", authService.register);

export default router;