import { GoogleAuth, Sheets } from 'sheets'
const googleAuth = new GoogleAuth

const auth = googleAuth.fromJSON(JSON.parse(Deno.env.get('GOOGLE_CREDENTIALS') || ''))

export const Sheet = new Sheets(auth)