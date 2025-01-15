import { createFactory } from 'hono/factory'
import { Sheet } from '../utils/sheets.ts'

const factory = createFactory();

// ENDPOINT /sheet/:id?start_row&sheet_name
export const getSheetRange = factory.createHandlers(async (c) => {
    const sheetId = c.req.param('id')
    const startRow = Number(c.req.query('start_row') || 0)
    const sheetName = c.req.query('sheet_name') || ''

    try {
        await Sheet.initialize(sheetId);
        const sheet = sheetName ? Sheet.instance.sheetsByTitle[sheetName] : Sheet.instance.sheetsByIndex[0];
        if (sheetName === 'INVENTÁRIO') sheet.loadHeaderRow(2)
        if (sheetName === 'COLABORADORES') sheet.loadHeaderRow(49)


        // Load only the requested range
        const rows = await sheet.getRows({
            offset: startRow
        }).then(rows => rows.map(row => row.toObject()));

        return c.json(rows, 200)
    } catch (e) {
        console.error(e)
        return c.text('Error accessing spreadsheet', 401)
    }
})

// ENDPOINT /sheet/:id/:cell?sheet_name
export const putSheetCell = factory.createHandlers(async (c) => {
    const sheetId = c.req.param('id')
    const cell = c.req.param('cell')
    const sheetName = c.req.query('sheet_name') || ''

    const body = await c.req.json()
    if (body.value === undefined) return c.text('Request is not the expected', 400)

    try {
        await Sheet.initialize(sheetId);
        const sheet = sheetName ? Sheet.instance.sheetsByTitle[sheetName] : Sheet.instance.sheetsByIndex[0];

        // Update cell
        await sheet.loadCells(cell)
        const updatedCell = sheet.getCell(0, 0)
        updatedCell.value = body.value
        await sheet.saveUpdatedCells()

        return c.text('Cell successfully updated', 200)
    } catch (e) {
        console.error(e)
        return c.text('Error updating spreadsheet', 401)
    }
})