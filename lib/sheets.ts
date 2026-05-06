import { google } from "googleapis";

export interface SheetRow {
  [column: string]: string;
}

function getAuthClient() {
  const keyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyB64) return null;

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(Buffer.from(keyB64, "base64").toString("utf-8"));
  } catch {
    return null;
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export interface SheetData {
  headers: string[];
  rows: SheetRow[];
  total: number;
}

/** Fetch all rows from a Google Sheet (read-only). Returns null if credentials are missing. */
export async function getSheetRows(
  sheetId: string,
  sheetName = "Sheet1"
): Promise<SheetData | null> {
  if (!sheetId) return null;

  const auth = getAuthClient();
  if (!auth) return null;

  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:ZZ`,
  });

  const values = response.data.values ?? [];
  if (values.length === 0) return { headers: [], rows: [], total: 0 };

  const [headerRow, ...dataRows] = values;
  const headers = headerRow.map(String);

  const rows: SheetRow[] = dataRows.map((row) => {
    const obj: SheetRow = {};
    headers.forEach((h, i) => {
      obj[h] = String(row[i] ?? "");
    });
    return obj;
  });

  return { headers, rows, total: rows.length };
}

/** Get just the submission count — cheaper for the overview page. */
export async function getSubmissionCount(
  sheetId: string,
  sheetName = "Sheet1"
): Promise<number | null> {
  const data = await getSheetRows(sheetId, sheetName);
  return data?.total ?? null;
}
