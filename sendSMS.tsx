import { z } from "zod";

/**
 * Sends an SMS using the Twilio REST API.
 * 
 * @param to The recipient's phone number in E.164 format.
 * @param body The text message content.
 * @returns An object containing a success boolean and an optional error message.
 */
export async function sendSMS(
  to: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
      console.warn("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN or TWILIO_PHONE_NUMBER missing.");
      return { success: false, error: "Configuration Twilio manquante" };
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append("To", to);
    formData.append("From", fromPhone);
    formData.append("Body", body);

    // Basic auth format for Twilio
    const auth = btoa(`${accountSid}:${authToken}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twilio SMS failed:", errorText);
      return { success: false, error: "Échec de l'envoi du SMS" };
    }

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Twilio SMS exception:", errorMsg);
    return { success: false, error: "Erreur lors de l'envoi du SMS" };
  }
}