import {Hono, type Context} from 'https://deno.land/x/hono@v3.12.7/mod.ts'
import {prettyJSON} from 'https://deno.land/x/hono/middleware.ts'
//import * as dotenv from "https://deno.land/std@0.213.0/dotenv/mod.ts"
import {GoogleAPI} from "https://deno.land/x/google_deno_integration/mod.ts"

const app = new Hono()
app.use('*', prettyJSON())
//const ENV = await dotenv.load()
const GoogleApi = new GoogleAPI({
	email: Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
	scope: [
		"https://www.googleapis.com/auth/drive",
		"https://www.googleapis.com/auth/drive.readonly",
		"https://www.googleapis.com/auth/drive.file",
		"https://www.googleapis.com/auth/spreadsheets",
		"https://www.googleapis.com/auth/spreadsheets.readonly"
	],
	key: Deno.env.get('GOOGLE_PRIVATE_KEY')
})

app.post('/trelloCard', async (c: Context) => {
	const request = c.req.json()
	
	const call = {
		employee: request["Funcionário"] || '',
		problem: request["Tipo do problema/solicitação"] || '',
		priority: request["Prioridade"] || 0,
		place: request["Onde você se encontra?"] || '',
		client: request["Cliente:"] || '',
		tablets: request["Tablets:"] || [0],
		thermal: request["Termovisores:"] || [0, 0, 0],
		digital_measure: request["Trena Digital:"] || [0],
		electric: request["Elétrica"] || [''],
		civil: request["Civil"] || [''],
		mechanic: request["Mecânica"] || [''],
		epi: request["EPI'S"] || [''],
		date: request["Data e hora da Retirada"] || '01/01/2001',
		description: request["Descrição:"] || ''
	}
	
	const TrelloCard = await fetchApiTrello('cards', createCardInfo(call))
	
	if (call.problem === "Solicitação de equipamento para auditoria") {
		const equipments = [
			call.tablets + ' tablets',
			call.thermal.reduce((acc, cur) => {
				return acc + parseInt(cur)
			}, 0) + ' Termovisores',
			call.digital_measure + ' Trenas digital',
			...call.electric, ...call.civil, ...call.mechanic, ...call.epi
		]
		
		await createChecklist(TrelloCard.id, {name: "Equipamentos", items: equipments})
	}
	
	return c.text('Trello card created successfully', 201)
})

app
	.get('/trelloAction', (c: Context) => {
		return c.text('Connected successfully!', 200)
	})
	.post(async (c) => {
		const request = await c.req.json()
		
		if (request.action.display.translationKey !== 'action_move_card_from_list_to_list') return c.text('Is not a card move in Trello', 406)
		if (request.action.data.listAfter.name !== 'Chamados Realizados') return c.text('Is not the right list', 400)
		
		const CardTrello = await fetchApiTrello(`cards/${request.action.display.entities.card.id}`, null, 'GET')
		
		const Sheet = await prepareCallSheet()
		console.log(Sheet)
		const IsStatusChanged = await changeCallStatus(Sheet.valueRanges[0].values, CardTrello.desc, "Concluído")
		if (IsStatusChanged === false) return c.text('Can not find the specified call in the sheet', 400)
		
		return c.text('Sheet updated!', 200)
	})

app.get('/', (c: Context) => {
	return c.text('Hello Hono!')
})

Deno.serve(app.fetch)

async function fetchApiTrello(path: string, body?, method = 'POST') {
	const response = await fetch(`https://api.trello.com/1/${path}?key=${Deno.env.get('TRELLO_APIKEY')}&token=${Deno.env.get('TRELLO_APITOKEN')}`, {
		method: method,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: body ? JSON.stringify(body) : null
	})
	
	console.log(
		`Fetching: Trello/${path}\n`,
		`Response: ${response.status} ${response.statusText}`
	)
	
	return JSON.parse(await response.text())
}

async function createChecklist(cardId: string, checklist) {
	const TrelloChecklist = await fetchApiTrello("checklists", {idCard: cardId, name: checklist.name})
	
	console.log('Creating the Checklist')
	for (const item of checklist.items) await fetchApiTrello(`checklists/${TrelloChecklist.id}/checkItems`, {
		name: item,
		checked: false
	})
}

function createCardInfo(call) {
	if (call.problem !== "Solicitação de equipamento para auditoria") {
		return {
			idList: Deno.env.get('TRELLO_IDLIST'),
			name: `${call.employee} - ${call.problem}`,
			desc:
				`## ${call.description}\n---\n` +
				`**Funcionário:** ${call.employee}\n` +
				`**Tipo de problema:** ${call.problem}\n` +
				`**Prioridade:** ${call.priority}\n` +
				`**Local:** ${call.place}\n` +
				`> *Arthur automatizações vrum vrum*`
		}
	}
	
	return {
		idList: Deno.env.get('TRELLO_IDLIST'),
		name: `${call.employee} - ${call.problem}`,
		desc:
			`## Cliente: **${call.client}**\n---\n` +
			`**Tablets:** ${call.tablets[0]}\n` +
			`**Termovisores:** ${parseInt(call.thermal[0]) + parseInt(call.thermal[1]) + parseInt(call.thermal[2])}\n` +
			`**Trena Digital:** ${call.digital_measure[0]}\n` +
			`**Elétrica:**\n${call.electric.map((item) => " " + item)}\n` +
			`**Civil:**\n${call.civil.map(item => " " + item)}\n` +
			`**Mecânica:**\n${call.mechanic.map(item => " " + item)}\n` +
			`**EPI's:**\n${call.epi.map(item => " " + item)}\n` +
			`**Data e Hora da Retirada:** ${call.date}\n` +
			`> *Arthur automatizações vrum vrum*`,
		due: new Date(call.date).toISOString()
	}
}

async function prepareCallSheet() {
	return await GoogleApi.get(`https://sheets.googleapis.com/v4/spreadsheets/${Deno.env.get('SPREADSHEET_CALLS_ID')}/values:batchGet?key=${Deno.env.get('GOOGLE_API_KEY')}&ranges=k${Deno.env.get('SHEET_START_ROW')}%3Aam${Deno.env.get('SHEET_END_ROW')}`)
}

async function changeCallStatus(sheet: Array<Array<string>>, desc, status) {
	let callRow = -1
	
	if (desc.startsWith('## Cliente:')) {
		const description = desc.slice(14).split('*')[0]
		
		for (const [index, row] of sheet.entries()) {
			if (row[2] === description) {
				callRow = parseInt(Deno.env.get('SHEET_START_ROW')) + index
			}
		}
	} else {
		const description = desc.slice(3).split('\n')[0]
		
		for (const [index, row] of sheet.entries()) {
			if (row[25] === description) {
				callRow = parseInt(Deno.env.get('SHEET_START_ROW')) + index
			}
		}
	}
	
	if (callRow === -1) return false
	
	const res = await GoogleApi.post(`https://sheets.googleapis.com/v4/spreadsheets/${Deno.env.get('SPREADSHEET_CALLS_ID')}/values:batchUpdate?key=${Deno.env.get('GOOGLE_API_KEY')}`,
		{
			"data": [{
				"values": [[status]],
				"range": `AL${callRow}`
			}], "valueInputOption": "USER_ENTERED"
		})
	
	
	
	return true
}