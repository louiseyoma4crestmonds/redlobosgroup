import { google } from "googleapis";
import { getSession } from "next-auth/react";

export default async function handler(req: any, res: any) {
  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  try {
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    res.status(200).json(events.data.items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
  return {};
}
