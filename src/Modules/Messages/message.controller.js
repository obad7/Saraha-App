import { Router } from "express";
import * as messageService from "./message.service.js";
import { asyncHandler } from '../../utils/error handling/asyncHandler.js';
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import { validation } from './../../Middlewares/validation.middleware.js';
import * as messageValidation from "./message.validation.js";
const router = Router();

router.post(
    "/sendMessage",
    authentication, 
    allowTo(["User"]),
    asyncHandler(messageService.sendMessage)
);

router.get(
    "/:messageId",
    authentication,
    allowTo(["User"]),
    validation(messageValidation.getSingleMessageSchema),
    asyncHandler(messageService.getSingleMessage)
);

router.get(
    "/",
    authentication, 
    allowTo(["User"]),
    validation(messageValidation.getAllMessagesSchema),
    asyncHandler(messageService.getAllMessages)
);

router.patch(
    "/:messageId",
    authentication, 
    allowTo(["User"]),
    validation(messageValidation.updateMessageSchema),
    asyncHandler(messageService.updateMessage)
);

router.delete(
    "/:messageId",
    authentication, 
    allowTo(["User"]),
    validation(messageValidation.deleteMessageSchema),
    asyncHandler(messageService.deleteMessage)
);


export default router;
