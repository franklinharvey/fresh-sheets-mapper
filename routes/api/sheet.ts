import { HandlerContext } from "$fresh/server.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// GET https://sheets.googleapis.com/v4/spreadsheets/1Po-5tui2kbZbyQS9eMaBuiM22VU75kxTnXmwWIHy7qc/values/StuffToDo!C4:C5
config({ export: true });
const key = Deno.env.get("GOOGLE_API_KEY");
const spreadsheetId = "1Po-5tui2kbZbyQS9eMaBuiM22VU75kxTnXmwWIHy7qc";
const range = "Tokyo Activities!A4:Z1000";

type R = {
  name: string;
  address: string;
  note: string;
  lat: string;
  lng: string;
  color: string;
};

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  // Specify the spreadsheet ID and range

  // Read the values from the spreadsheet
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`
  );

  if (!response.ok) {
    console.error("Error reading from Google Sheets:", response.statusText);
    throw new Error(response.statusText);
  }

  const data: { values: [string, string, string, string, string][] } =
    await response.json();

  const values = data.values;
  const ret: R[] = [];
  if (values) {
    values.forEach((row: string[]) => {
      try {
        ret.push({
          name: row[0],
          note: row[1],
          address: row[2],
          lat: row[3].split(", ")[0],
          lng: row[3].split(", ")[1],
          color: row[4],
        });
      } catch (error) {
        console.error(`Error: ${error}. Row: ${row}`);
      }
    });
  } else {
    console.error("No data found.");
  }
  return new Response(JSON.stringify(ret));
};
