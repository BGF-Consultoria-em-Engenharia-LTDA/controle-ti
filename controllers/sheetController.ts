import { createFactory } from 'hono/factory'
import { Sheet } from '../utils/sheets.ts'


const factory = createFactory();

// ENDPOINT /sheet/:id
export const getSheetRange = factory.createHandlers(async (c) => {
    const SheetId = c.req.param('id')
    const CellsRange = c.req.query('cells_range')
    if (CellsRange === undefined) return c.text('Request is not the expected', 400)

    console.info('Fetching: Calls spreadshett')
    try {
        const Cells = await Sheet.spreadsheetsValuesBatchGet(SheetId, { ranges: CellsRange })
        return c.json(Cells, 200)
    } catch (e) {
        console.error(e)
        return c.text('Without permission to access the spreadsheet', 401)
    }
})

// ENDPOINT /sheet/:id/cell?cell_range
export const putSheetCell = factory.createHandlers(async (c) => {
    const SheetId = c.req.param('id')
    const CellRange = c.req.query('cell_range')
    if (CellRange === undefined) return c.text('Request is not the expected', 400)
    
    const Body = await c.req.json()
    if (Body.value === undefined) return c.text('Request is not the expected', 400)

    console.info(
        `Updating: ${CellRange}\n`,
        `Value: ${Body.value}`
    )
    try {
        const _ChangedCell = await Sheet.spreadsheetsValuesBatchUpdate(SheetId, {
            'data': [{
                'values': [[Body.value]],
                'range': CellRange
            }], 'valueInputOption': 'USER_ENTERED'
        })
    } catch (e) {
        console.error(e)
        return c.text('Without permission to access the spreadsheet', 401)
    }
    
    return c.text('Cell successfully updated', 200)
})