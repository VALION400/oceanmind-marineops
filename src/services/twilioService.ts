import twilio from "twilio";
import { getEnv } from "../config/env";

type TwilioMessageResponse = {
  sid: string;
  status: string;
};

export async function sendMessage(
  to: string,
  body: string
): Promise<TwilioMessageResponse> {
  const env = getEnv();

  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

  const message = await client.messages.create({
    from: env.TWILIO_WHATSAPP_NUMBER,
    to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
    body: body,
  });

  return {
    sid: message.sid,
    status: message.status,
  };
}
