export interface SpreadsheetGetValueRanges {
    range: string,
    majorDimension: string,
    values: Array<Array<string>>
}

interface SpreadsheetUpdateResponse {
    spreadsheetId: string,
    updatedRange: string,
    updatedRows: number,
    updatedColumns: number,
    updatedCells: number
}

interface Error {
    code: number,
    message: string,
    status: string
}

export interface SpreadsheetGet {
    spreadsheetId: string,
    valueRanges: Array<SpreadsheetGetValueRanges>
    error?: Error
}

export interface SpreadsheetUpdate {
    spreadsheetId: string,
    totalUpdatedRows: number,
    totalUpdatedColumnds: number,
    totalUpdatedSheets: number,
    responses: Array<SpreadsheetUpdateResponse>
    error?: Error
}
