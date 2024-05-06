export interface StockData {
	row: number,
	item: Item,
	model?: string,
	tag?: string,
	notes?: string,
	status: Status,
	condition: Condition,
	location?: string,
    affiliation?: CollaboratorsData,
	historical?: Array<string>,
	oldTag?: string,
	broken: {
        isBroken: boolean,
        date?: Date,
        who?: string
    },
	lastUpdate: Date
}

export type Item = "Notebook" | "Monitor" | "Mouse" | "Teclado" | "Mousepad" | "Adaptador VGA/HDMI" | "Adaptador VGA/USB" | "Docker" | "Carregador Notebook" | "Cabo de Rede" | "Suporte Notebook" | "Carregador Tablet" | "Power Bank" | "Carregador Dock" | "Leitor Cartão SD" | "Cartão SD" | "Rádio Comunicador" | "Cabo HDMI" | "Cabo VGA" | "Adaptador Rede/USB" | "Bolsa Notebook" | "Tablet"
export type Status = "Disponível" | "Em uso" | "Quebrado"
export type Condition = "Bom" | "Defeituoso" | "Quebrado"

export interface CollaboratorsData {
	row: number,
	name: string,
	tag: string,
	status: "Ativo" | "Inativo"
}