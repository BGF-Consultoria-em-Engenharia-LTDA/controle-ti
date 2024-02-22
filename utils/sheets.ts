import { GoogleAuth, Sheets } from 'sheets'
import aa from '../googleCredentials.json' with {type: 'json'}
const googleAuth = new GoogleAuth

const auth = googleAuth.fromJSON(aa)

export const Sheet = new Sheets(auth)