import { createFactory } from 'hono/factory'
import { SpreadsheetGet, SpreadsheetGetValueRanges } from '../types/sheet.ts'
import { Card, CardData, RequestCall, RequestAction, Checklist, Checks, Call } from '../types/trello.ts'
import { get, post, put } from '../utils/http.ts'

const factory = createFactory()

// ENDPOINT /trello/cards/:id
export const getTrelloCard = factory.createHandlers(async (c) => {
	const Id = c.req.param('id')

	const TrelloCard = await get(`https://api.trello.com/1/cards/${Id}?key=${Deno.env.get('TRELLO_APIKEY')}&token=${Deno.env.get('TRELLO_APITOKEN')}`)
	if (TrelloCard === null) return c.text('Card ID doesn\'t exist.', 404)

	return c.json(TrelloCard, 200)
})

// ENDPOINT /trello/cards
export const postTrelloCard = factory.createHandlers(async (c) => {
	const Request: RequestCall = await c.req.json()
	
	const [CardData, Checklist] = createCardInfo(Request)
	const TrelloCard = await post<Card>(
		`https://api.trello.com/1/cards?key=${Deno.env.get('TRELLO_APIKEY')}&token=${Deno.env.get('TRELLO_APITOKEN')}`, 
		CardData
	)
	if (TrelloCard.status !== 200) return c.text('Request is not the expected', 400)

	if (Request["Tipo do problema/solicitação"] === 'Solicitação de equipamento para auditoria') createChecklist(TrelloCard.parsedBody!.id, Checklist)
	
	return c.json(TrelloCard, 201)
})

// ENDPOINT /trello/actions
export const headTrelloAction = factory.createHandlers((c) => {
	return c.text('Webhook connected successfully!', 200)
})

export const postTrelloAction = factory.createHandlers(async (c)=> {
	const Request: RequestAction = await c.req.json()
	if (Request.action.display.translationKey !== 'action_move_card_from_list_to_list') return c.text('Is not a card move in Trello', 406)
	if (Request.action.data.listAfter.name !== 'Chamados Realizados') return c.text('Is not the right list', 400)
	
	const CardTrello = await get<Card>(`${Deno.env.get('BASE_URL')}/trello/cards/${Request.action.display.entities.card.id}`)
	if (CardTrello.parsedBody === undefined) return c.text('Can not find Trello Card', 500)
	const CardDescription = CardTrello.parsedBody!.desc

	const Sheet = (CardDescription.startsWith('## Cliente:') ?
		await get<SpreadsheetGet>(`${Deno.env.get('BASE_URL')}/sheet/${Deno.env.get('SPREADSHEET_CALLS_ID')}?cells_range=M${Deno.env.get('SHEET_START_ROW')}:M${Deno.env.get('SHEET_END_ROW')}`) :
		await get<SpreadsheetGet>(`${Deno.env.get('BASE_URL')}/sheet/${Deno.env.get('SPREADSHEET_CALLS_ID')}?cells_range=AL${Deno.env.get('SHEET_START_ROW')}:AJ${Deno.env.get('SHEET_END_ROW')}`))

	if (Sheet.status !== 200) return c.text('Can not get the calls sheet', 502)
	
	const RowNumber = findRowByDescription(Sheet.parsedBody!.valueRanges[0], CardDescription)
	if (RowNumber === null) return c.text('Call not found', 404)

	const updatedCell = await put(
		`${Deno.env.get('BASE_URL')}/sheet/${Deno.env.get('SPREADSHEET_CALLS_ID')}/cell?cell_range=AN${parseInt(Deno.env.get('SHEET_START_ROW')!) + RowNumber!}`,
		{ value: 'Concluído' }
	)
	if (updatedCell.status !== 200) return c.text('Can not update the calls sheet', 502)

	return c.text('Successfully updated the call status', 200)
})

function createCardInfo(callReq: RequestCall): [CardData, Checks] {
	const Call: Call = {
		employee: callReq['Funcionário'] || '',
		problem: callReq['Tipo do problema/solicitação'] || '',
		priority: callReq['Prioridade'] || 0,
		place: callReq['Onde você se encontra?'] || '',
		client: callReq['Cliente:'] || '',
		tablets: callReq['Tablets:'] || [],
		thermal: callReq['Termovisores:'] || [],
		digital_measure: callReq['Trena Digital:'] || [],
		electric: callReq['Elétrica'] || [],
		civil: callReq['Civil'] || [],
		mechanic: callReq['Mecânica'] || [],
		epi: callReq['EPI\'S'] || [],
		date: callReq['Data e hora da Retirada'] || '',
		description: callReq['Descrição:'] || ''
	}
	
	console.info(
		'Generating Card Info\n',
		JSON.stringify(Call)
	)

	const Checklist: Checks = {name: 'Equipamentos', items: []}

	if (Call.tablets.length > 0) Checklist.items.push(`${Call.tablets} tablets`)
	if (Call.thermal.length > 0) Checklist.items.push(`${Call.thermal.reduce((acc, cur) => {return acc + parseInt(cur || '0')}, 0)} termovisores`)
	if (Call.digital_measure.length > 0) Checklist.items.push(`${Call.digital_measure} trenas digital`)
	Checklist.items.push(...Call.electric, ...Call.civil, ...Call.mechanic, ...Call.epi)

	console.info(
		'Generating Checklist\n',
		JSON.stringify(Checklist)
	)

	if (Call.problem !== 'Solicitação de equipamento para auditoria') {
		return [{
			idList: Deno.env.get('TRELLO_IDLIST') || '',
			name: `${Call.employee} - ${Call.problem}`,
			desc:
				`## ${Call.description}\n---\n` +
				`**Funcionário:** ${Call.employee}\n` +
				`**Tipo de problema:** ${Call.problem}\n` +
				`**Prioridade:** ${Call.priority}\n` +
				`**Local:** ${Call.place}\n` +
				`> *Arthur automatizações vrum vrum*`,
			due: new Date(Date.now() + 60 * 60 * 1000).toISOString()
		}, Checklist]
	}
	
	return [{
		idList: Deno.env.get('TRELLO_IDLIST') || '',
		name: `${Call.employee} - ${Call.problem}`,
		desc:
			`## Cliente: **${Call.client}**\n---\n` +
			`**Tablets:** ${Call.tablets[0] || 0}\n` +
			`**Termovisores:** ${Call.thermal.reduce((acc, cur) => {return acc + parseInt(cur)}, 0)}\n` +
			`**Trena Digital:** ${Call.digital_measure[0] || 0}\n` +
			`**Elétrica:**\n${Call.electric.map((item: string) => " " + item)}\n` +
			`**Civil:**\n${Call.civil.map((item: string) => " " + item)}\n` +
			`**Mecânica:**\n${Call.mechanic.map((item: string) => " " + item)}\n` +
			`**EPI's:**\n${Call.epi.map((item: string) => " " + item)}\n` +
			`**Data e Hora da Retirada:** ${Call.date}\n` +
			`> *Arthur automatizações vrum vrum*`,
		due: new Date(Call.date).toISOString()
	}, Checklist]
}

async function createChecklist(cardId: string, checks: Checks): Promise<void> {
	const TrelloChecklist = await post<Checklist>(
		`https://api.trello.com/1/checklists?key=${Deno.env.get('TRELLO_APIKEY')}&token=${Deno.env.get('TRELLO_APITOKEN')}`, 
		{idCard: cardId, name: checks.name}
	)
	
	console.info('Creating the Checklist')
	for (const item of checks.items) {
		await post<Checks>(
			`https://api.trello.com/1/checklists/${TrelloChecklist.parsedBody!.id}/checkItems?key=${Deno.env.get('TRELLO_APIKEY')}&token=${Deno.env.get('TRELLO_APITOKEN')}`, 
			{name: item, checked: false}
		)
	}
}

function findRowByDescription(sheet: SpreadsheetGetValueRanges, desc: string): number|null {
	const Description = desc.startsWith('## Cliente:') ? desc.slice(14).split('*')[0] : desc.slice(3).split('\n')[0]
	let i: number|null = null
 	for (const [index, row] of sheet.values.entries()) {
		if (row[0] === Description) {
			i = index
			break
		}
 	}

 	return i
}