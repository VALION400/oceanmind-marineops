import cron, { ScheduledTask } from "node-cron";
import { getDueReminders, markReminderCompleted } from "../business/reminderHandler";
import { sendMessage } from "./twilioService";

let cronJob: ScheduledTask | null = null;

export function startReminderService(): void {
  if (cronJob) {
    console.log("[Reminder Service] Already running.");
    return;
  }

  // Run every minute
  cronJob = cron.schedule("* * * * *", async () => {
    try {
      console.log("[Reminder Service] Checking for due reminders...");

      const dueReminders = await getDueReminders();

      if (dueReminders.length === 0) {
        console.log("[Reminder Service] No due reminders found.");
        return;
      }

      console.log(`[Reminder Service] Found ${dueReminders.length} due reminder(s).`);

      for (const reminder of dueReminders) {
        try {
          const phoneNumber = reminder.users?.phone_number;
          if (!phoneNumber) {
            console.error("[Reminder Service] No phone number for reminder:", reminder.id);
            continue;
          }

          await sendMessage(phoneNumber, `🔔 OceanMind Reminder:\n\n${reminder.message}`);

          await markReminderCompleted(reminder.id);
          console.log(`[Reminder Service] Sent and completed reminder ${reminder.id} to ${phoneNumber}`);
        } catch (error) {
          console.error(`[Reminder Service] Failed to process reminder ${reminder.id}:`, error);
        }
      }
    } catch (error) {
      console.error("[Reminder Service] Error in cron job:", error);
    }
  });

  console.log("[Reminder Service] Started — checking every minute.");
}

export function stopReminderService(): void {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log("[Reminder Service] Stopped.");
  }
}
