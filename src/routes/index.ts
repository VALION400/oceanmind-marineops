import { Router } from "express";
import whatsappRouter from "./whatsapp";

const router = Router();

// WhatsApp webhook
router.use(whatsappRouter);

export default router;
