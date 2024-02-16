import { createFactory } from 'hono/factory'
import { GoogleAPI } from 'googleAPI'
import { SpreadsheetGet, SpreadsheetUpdate } from '../types/sheet.ts';

const factory = createFactory();

const GoogleApi = new GoogleAPI({
	email: Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL') || '',
	scope: [
		'https://www.googleapis.com/auth/drive',
		'https://www.googleapis.com/auth/drive.readonly',
		'https://www.googleapis.com/auth/drive.file',
		'https://www.googleapis.com/auth/spreadsheets',
		'https://www.googleapis.com/auth/spreadsheets.readonly'
	],
	key: Deno.env.get('GOOGLE_PRIVATE_KEY') || ''
})

// ENDPOINT /sheet/:id
export const getSheetRange = factory.createHandlers(async (c) => {
    const SheetId = c.req.param('id')
    const CellsRange = c.req.query('cells_range')
    if (CellsRange === undefined) return c.text('Request is not the expected', 400)

    const Cells: SpreadsheetGet = await GoogleApi.get(`https://sheets.googleapis.com/v4/spreadsheets/${SheetId}/values:batchGet?key=${Deno.env.get('GOOGLE_API_KEY')}&ranges=${CellsRange}`)
    if (Cells.error) return c.text('Without permission to access the spreadsheet', 401)

    return c.json(Cells, 200)
})

// ENDPOINT /sheet/:id/cell?cell_range
export const putSheetCell = factory.createHandlers(async (c) => {
    const SheetId = c.req.param('id')
    const CellRange = c.req.query('cell_range')
    if (CellRange === undefined) return c.text('Request is not the expected', 400)
    
    const Body = await c.req.json()
    if (Body.value === undefined) return c.text('Request is not the expected', 400)

    const ChangedCell: SpreadsheetUpdate = await GoogleApi.post(`https://sheets.googleapis.com/v4/spreadsheets/${SheetId}/values:batchUpdate?key=${Deno.env.get('GOOGLE_API_KEY')}`, {
        'data': [{
            'values': [[Body.value]],
            'range': CellRange
        }], 'valueInputOption': 'USER_ENTERED'
    })
    if (ChangedCell.error) return c.text('Without permission to access the spreadsheet', 401)
    
    return c.text('Cell successfully updated', 200)
})