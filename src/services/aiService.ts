import OpenAI from "openai";
import { getEnv } from "../config/env";
import { ParsedIntent } from "../types";

const SYSTEM_PROMPT = `
You are OceanMind, an AI assistant for marine and offshore operations management.

Your task is to parse incoming WhatsApp messages from marine operators and convert them into structured JSON actions.

## Supported Actions

1. update_vessel - Update vessel status or information
   Example: "Update vessel Alpha, maintenance completed" -> { action: "update_vessel", vessel: "Alpha", status: "maintenance completed" }

2. query_vessel - Ask about vessel status or information
   Example: "What is the status of vessel Alpha?" -> { action: "query_vessel", vessel: "Alpha" }
   Example: "When is next maintenance for Vessel X?" -> { action: "query_vessel", vessel: "X", question: "next maintenance" }

3. update_crew - Update crew status or assignments
   Example: "Crew for Vessel Bravo ready" -> { action: "update_crew", vessel: "Bravo", status: "ready" }

4. query_crew - Ask about crew information
   Example: "How many crew members on vessel Alpha?" -> { action: "query_crew", vessel: "Alpha" }

5. log_event - Log an operational event
   Example: "Log: fuel delivery completed for vessel Alpha" -> { action: "log_event", vessel: "Alpha", details: "fuel delivery completed" }

6. set_reminder - Set a reminder for a future event
   Example: "Remind me about vessel Alpha maintenance in 2 days" -> { action: "set_reminder", vessel: "Alpha", details: "maintenance", reminder_minutes: 2880 }
   Note: Convert time expressions to minutes (1 day = 1440, 1 hour = 60)

7. query_reminder - Ask about existing reminders
   Example: "What reminders do I have?" -> { action: "query_reminder" }

8. unknown - When the message cannot be categorized
   Example: "Hello" -> { action: "unknown" }

## Rules

- Always return valid JSON
- Extract vessel name when mentioned
- Extract relevant details (status, dates, crew names)
- For time-based reminders, calculate minutes from natural language
- If unsure about vessel name, leave vessel field empty
- If action is unclear, set action to "unknown"
- Be confident in your extraction (confidence 0.0 to 1.0)
- Do NOT include any text outside the JSON object
`;

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    const env = getEnv();
    openaiClient = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export async function parseIntent(message: string): Promise<ParsedIntent> {
  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 256,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI returned empty response");
    }

    const parsed: ParsedIntent = JSON.parse(content);

    // Validate required field
    if (!parsed.action) {
      parsed.action = "unknown";
    }

    // Sanitize strings
    if (parsed.vessel) parsed.vessel = parsed.vessel.trim();
    if (parsed.status) parsed.status = parsed.status.trim();
    if (parsed.details) parsed.details = parsed.details.trim();
    if (parsed.crew) parsed.crew = parsed.crew.trim();

    return parsed;
  } catch (error) {
    console.error("[AI Service] Error parsing intent:", error);
    
    // Return safe fallback
    return {
      action: "unknown",
      confidence: 0,
    };
  }
}