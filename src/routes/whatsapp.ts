import { Router, Request, Response, NextFunction } from "express";
import { sendMessage } from "../services/twilioService";
import { parseIntent } from "../services/aiService";
import { TwilioWebhookBody } from "../types";
import { getOrCreateUser, updateVesselStatus, queryVesselStatus, listVessels } from "../business/vesselHandler";
import { updateCrewStatus, queryCrewCount } from "../business/crewHandler";
import { logAction } from "../business/logHandler";
import { createReminder, listReminders } from "../business/reminderHandler";

const router = Router();

async function handleIntent(_from: string, userId: string, intent: any): Promise<string> {
  const { action, vessel, status, question, details, reminder_minutes } = intent;

  try {
    switch (action) {
      case "update_vessel": {
        if (!vessel || !status) {
          return "Please specify the vessel name and status. Example: \"Update vessel Alpha, maintenance completed\"";
        }
        const result = await updateVesselStatus(userId, vessel, status);
        await logAction(userId, "update_vessel", `Status: ${status}`, vessel);
        return result.created
          ? `New vessel "${vessel}" registered with status: ${status}.`
          : `Vessel "${vessel}" updated — Status: ${status}.`;
      }

      case "query_vessel": {
        if (!vessel) {
          const vessels = await listVessels(userId);
          if (vessels.length === 0) {
            return "You have no vessels registered yet. Update a vessel to get started.";
          }
          const list = vessels.map((v) => `• ${v.name} — ${v.status}`).join("\n");
          return `Your fleet:\n${list}`;
        }
        const response = await queryVesselStatus(userId, vessel);
        await logAction(userId, "query_vessel", question || "general inquiry", vessel);
        return response;
      }

      case "update_crew": {
        if (!vessel || !status) {
          return "Please specify the vessel and crew status. Example: \"Crew for Vessel Bravo ready\"";
        }
        const response = await updateCrewStatus(userId, vessel, status);
        await logAction(userId, "update_crew", `Status: ${status}`, vessel);
        return response;
      }

      case "query_crew": {
        if (!vessel) {
          return "Please specify the vessel name. Example: \"How many crew members on vessel Alpha?\"";
        }
        const response = await queryCrewCount(userId, vessel);
        await logAction(userId, "query_crew", "crew inquiry", vessel);
        return response;
      }

      case "log_event": {
        if (!details) {
          return "Please provide event details. Example: \"Log: fuel delivery completed for vessel Alpha\"";
        }
        await logAction(userId, "log_event", details, vessel);
        return `Event logged successfully: ${details}${vessel ? ` (vessel: ${vessel})` : ""}.`;
      }

      case "set_reminder": {
        if (!reminder_minutes || !details) {
          return "Please specify the reminder time and details. Example: \"Remind me about vessel Alpha maintenance in 2 days\"";
        }
        const response = await createReminder(userId, vessel, details, reminder_minutes);
        await logAction(userId, "set_reminder", details, vessel);
        return response;
      }

      case "query_reminder": {
        const response = await listReminders(userId);
        await logAction(userId, "query_reminder", "reminder inquiry");
        return response;
      }

      case "unknown":
      default: {
        return "I didn't understand that. Try commands like:\n" +
          "• Update vessel Alpha, maintenance completed\n" +
          "• Crew for Vessel Bravo ready\n" +
          "• When is next maintenance for Vessel X?\n" +
          "• Remind me about vessel Alpha maintenance in 2 days\n" +
          "• Show my fleet";
      }
    }
  } catch (error: any) {
    console.error(`[Business Logic] Error handling ${action}:`, error);
    return `An error occurred while processing your request. Please try again.`;
  }
}

router.post("/webhook", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { From, Body, MessageSid } = req.body as TwilioWebhookBody;

    console.log(`[WhatsApp] Incoming message from ${From}: ${Body}`);
    console.log(`[WhatsApp] MessageSid: ${MessageSid}`);

    // Step 1: Parse intent using OpenAI
    const intent = await parseIntent(Body);
    console.log(`[AI] Parsed intent: ${JSON.stringify(intent)}`);

    // Step 2: Get or create user
    const userId = await getOrCreateUser(From);

    // Step 3: Handle intent through business logic
    const replyBody = await handleIntent(From, userId, intent);

    // Step 4: Log the user message
    await logAction(userId, "incoming_message", Body);

    await sendMessage(From, replyBody);

    console.log(`[WhatsApp] Reply sent to ${From}`);

    // Twilio expects empty response for TwiML-less replies
    res.set("Content-Type", "text/xml");
    res.send("");
  } catch (error) {
    next(error);
  }
});

export default router;
