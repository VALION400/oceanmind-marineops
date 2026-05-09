import { Request, Response, NextFunction } from "express";
import twilio from "twilio";
import { getEnv } from "../config/env";

// Type-safe access to RequestValidator
const RequestValidator = (twilio as any).RequestValidator;

/**
 * Validates Twilio request signature to ensure requests are genuinely from Twilio.
 * Skip validation in development mode for local testing with ngrok.
 */
export function validateTwilioRequest(req: Request, res: Response, next: NextFunction): void {
  const env = getEnv();

  // Skip validation in development mode
  if (env.NODE_ENV === "development") {
    next();
    return;
  }

  const twilioSignature = req.headers["x-twilio-signature"] as string;

  if (!twilioSignature) {
    res.status(401).json({
      success: false,
      error: "Missing Twilio signature",
    });
    return;
  }

  const validator = new RequestValidator(env.TWILIO_AUTH_TOKEN);

  // Build the full URL from the request
  const protocol = req.protocol;
  const host = req.get("host");
  const url = `${protocol}://${host}${req.originalUrl}`;

  const isValid = validator.validate(url, req.body, twilioSignature);

  if (!isValid) {
    console.error("[Security] Invalid Twilio signature");
    res.status(401).json({
      success: false,
      error: "Invalid request signature",
    });
    return;
  }

  next();
}
