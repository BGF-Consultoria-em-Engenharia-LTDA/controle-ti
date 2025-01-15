export interface StockData {
	Equipamento: Item;
	Modelo: string;
	Tag: string;
	"N°": string;
	Notas: string;
	Status: Status;
	Condição: Condition;
	Local: string;
	Afiliação: string;
	Histórico: string;
	"Nova Tag": string;
	"Tag Antiga": string;
	Quebrado: {
		"Quem quebrou": string;
		"Data que quebrou": string;
	};
	"Ultima Atualização": string;
	HELPER: string;
}

export interface StockItem extends StockData {
	row: number,
	history: string[],
	affiliation: CollaboratorsData
}

export type Item = "Notebook" | "Monitor" | "Mouse" | "Teclado" | "Mousepad" | "Adaptador VGA/HDMI" | "Adaptador VGA/USB" | "Docker" | "Carregador Notebook" | "Cabo de Rede" | "Suporte Notebook" | "Carregador Tablet" | "Power Bank" | "Carregador Dock" | "Leitor Cartão SD" | "Cartão SD" | "Rádio Comunicador" | "Cabo HDMI" | "Cabo VGA" | "Adaptador Rede/USB" | "Bolsa Notebook" | "Tablet"
export type Status = "Disponível" | "Em uso" | "Quebrado"
export type Condition = "Bom" | "Defeituoso" | "Quebrado"

export interface CollaboratorsData {
	NOME: string,
	TAG: string,
	STATUS: "Ativo" | "Inativo"
}