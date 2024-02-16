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
	'Descrição:'?: string
}

type SwitcherViews = { viewType: 'Board' | 'Table' | 'Calendar' | 'Dashboard' | 'Timeline' | 'Map', enabled: boolean }
type BackgroundImageScaled = { width: number, height: number, url: string }
export interface RequestAction {
	model: {
		id: string,
		name: string,
		desc: string,
		descData: null|string,
		closed: boolean,
		idOrganization: string,
		idEnterprise: null|string,
		pinned: boolean,
		url: string,
		shortUrl: string,
		prefs: {
			permissionLevel: string,
			hideVotes: boolean,
			voting: string,
			comments: string,
			invitations: string,
			selfJoin: boolean,
			cardCovers: boolean,
			cardCounts: boolean,
			isTemplate: boolean,
			cardAging: string,
			calendarFeedEnabled: boolean,
			hiddenPluginBoardButtons: Array<string>,
			switcherViews: Array<SwitcherViews>,
			background: string,
			backgroundColor: null|string,
			backgroundImage: string,
			backgroundTile: boolean,
			backgroundBrightness: string,
			backgroundImageScaled: Array<BackgroundImageScaled>,
			backgroundBottomColor: string,
			backgroundTopColor: string,
			canBePublic: boolean,
			canBeEnterprise: boolean,
			canBeOrg: boolean,
			canBePrivate: boolean,
			canInvite: boolean
		},
		labelNames: {
			green: string,
			yellow: string,
			orange: string,
			red: string,
			purple: string,
			blue: string,
			sky: string,
			lime: string,
			pink: string,
			black: string,
			green_dark: string,
			yellow_dark: string,
			orange_dark: string,
			red_dark: string,
			purple_dark: string,
			blue_dark: string,
			sky_dark: string,
			lime_dark: string,
			pink_dark: string,
			black_dark: string,
			green_light: string,
			yellow_light: string,
			orange_light: string,
			red_light: string,
			purple_light: string,
			blue_light: string,
			sky_light: string,
			lime_light: string,
			pink_light: string,
			black_light: string
		}
	},
	action: {
		id: string,
		idMemberCreator: string,
		data: {
			card: {
				idList: string,
				id: string,
				name: string,
				idShort: number,
				shortLink: string
			},
			old: { idList: string },
			board: {
				id: string,
				name: string,
				shortLink: string
			},
			listBefore: { id: string, name: string },
			listAfter: { id: string, name: string }
		},
		appCreator: null|string,
		type: string,
		date: string,
		limits: null|number,
		display: {
			translationKey: string,
			entities: {
				card: {
					type: string,
					id: string,
					idList: string,
					shortLink: string,
					text: string
				},
				listBefore: {
					type: string,
					id: string,
					text: string
				},
				listAfter: {
					type: string,
					id: string,
					text: string
				},
				memberCreator: {
					type: string,
					id: string,
					username: string,
					text: string
				}
			}
		},
		memberCreator: {
			id: string,
			activityBlocked: boolean,
			avatarHash: string,
			avatarUrl: string,
			fullName: string,
			idMemberReferrer: null|string,
			initials: string,
			nonPublic: Record<string | number | symbol, never>,
			nonPublicAvailable: boolean,
			username: string
		}
	},
	webhook: {
		id: string,
		description: string,
		idModel: string,
		callbackURL: string,
		active: boolean,
		consecutiveFailures: number,
		firstConsecutiveFailDate: null|string
	}
}

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
	description: string
}