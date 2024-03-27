export interface Card {
	id: string,
	address: string,
	badges: {
		attachmentsByType: { trello: { board: number, card: number } }
		location: boolean,
		votes: number,
		viewingMemberVoted: boolean,
		subscribed: boolean,
		fogbugz: string,
		checkItems: number,
		checkItemsChecked: number,
		comments: number,
		attachments: number,
		description: boolean,
		due: string,
		start: string,
		dueComplete: boolean
	},
	checkItemStates: Array<string>,
	closed: boolean,
	coordinates: string,
	creationMethod: string,
	dateLastActivity: string,
	desc: string,
	descData: { emoji: Record<string | number | symbol, never> },
	due: string,
	dueReminder: string,
	email: string,
	idBoard: string,
	idChecklists: [{ id: string }],
	idLabels: [{ id: string, idBoard: string, name: string, color: string }],
	idList: string,
	idMembers: Array<string>,
	idMembersVoted: Array<string>,
	idShort: number,
	labels: Array<string>,
	limits: { attachments: { perBoard: { status: string, disableAt: number, warnAt: number } } },
	locationName: string,
	manualCoverAttachment: boolean,
	name: string,
	pos: number,
	shortLink: string,
	shortUrl: string,
	subscribed: boolean,
	url: string,
	cover: {
		color: string, idUploadedBackground: boolean,
		size: string,
		brightness: string,
		isTemplate: boolean
	}
}

export interface CardData {
	name: string,
	desc: string,
	pos?: string | number,
	due: string,
	start?: string,
	dueComplete?: boolean,
	idList: string,
	idMembers?: Array<string>,
	idLabels?: Array<string>,
	urlSource?: string,
	fileSource?: string,
	mimeType?: string,
	idCardSource?: string,
	keepFromSource?: string,
	address?: string,
	locationName?: string,
	coordinates?: string,
}

export enum Priority { Low = '1', Medium = '2', High = '3' } // number in string

export interface RequestCall {
	'Funcionário': string,
	'Tipo do problema/solicitação': string,
	'Prioridade': Priority,
	'Onde você se encontra?': string,
	'Cliente:'?: string,
	'Tablets:'?: Array<string>,				// number in string
	'Termovisores:'?: Array<string>,	// number in string
	'Trena Digital:'?: Array<string>,	// number in string
	'Elétrica'?: Array<string>,
	'Civil'?: Array<string>,
	'Mecânica'?: Array<string>,
	'EPI\'S'?: Array<string>,
	'Data e hora da Retirada'?: string, // date in string
	'O que deseja?': Array<string>,
	'Descrição:'?: string
}

type SwitcherViews = { viewType: 'Board' | 'Table' | 'Calendar' | 'Dashboard' | 'Timeline' | 'Map', enabled: boolean }
type BackgroundImageScaled = { width: number, height: number, url: string }

export interface Checklist {
	id: string,
	name: string,
	idBoard: string,
	idCard: string,
	pos: number,
	checkItems: Array<string>,
	limitis: Record<string | number | symbol, never>
}

export interface Checks {
	name: string,
	items: Array<string>
}

export interface Call {
	employee: string,
	problem: string,
	priority: Priority,
	place: string,
	client: string,
	tablets: Array<string|number>,
	thermal: Array<string>,
	digital_measure: Array<string|number>,
	electric: Array<string>,
	civil: Array<string>,
	mechanic: Array<string>,
	epi: Array<string>,
	date: string|Date,
	equipments: Array<string>,
	description: string
}