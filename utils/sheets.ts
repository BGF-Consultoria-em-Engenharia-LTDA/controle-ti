import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth';

// service account auth client
const serviceAccountAuth = new JWT({
  email: Deno.env.get('GOOGLE_CLIENT_EMAIL'),
  key: Deno.env.get('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// abstract sheet class
export class Sheet {
  private static auth = serviceAccountAuth;
  private static doc: GoogleSpreadsheet | null = null;

  static async initialize(spreadsheetId: string) {
    this.doc = new GoogleSpreadsheet(spreadsheetId, this.auth);
    await this.doc.loadInfo();
    return this.doc;
  }

  static get instance() {
    if (!this.doc) {
      throw new Error('Sheet not initialized. Call Sheet.initialize() first.');
    }
    return this.doc;
  }
}