import { createFactory } from "hono/factory";
import { Context } from "hono";
import { app } from "../index.ts";
import { StockData, StockItem, CollaboratorsData } from "../types/stock.ts";

const factory = createFactory();

// ENDPOINT /stock
export const getStock = factory.createHandlers(async (c: Context) => {
  const sheetReq = await app.request(`/sheet/${Deno.env.get("SPREADSHEET_BACKLOG_ID")}?sheet_name=INVENTÁRIO`);
  if (sheetReq.status !== 200) return c.text("Can not get the backlog sheet", 502);
  const StockItemsReq: StockData[] = await sheetReq.json();

  const colabReq = await app.request(`/collaborators`);
  if (colabReq.status !== 200) return c.text("Can not get the collaborators sheet", 502);
  const Collaborators: CollaboratorsData[] = await colabReq.json();

  const StockItems: StockItem[] = StockItemsReq.map((item: StockData, i) => {
    let affiliation: CollaboratorsData = { NOME: "", TAG: "", STATUS: "Inativo" }
    for (const colab of Collaborators) {
      if (colab.TAG == item.Afiliação) {
        affiliation = colab;
        break;
      }
    }
    return {
      row: i,
      ...item,
      affiliation,
      Tag: item.Tag + "-" + item["N°"],
      history: item.Histórico.split(" / "),
    };
  });

  return c.json(StockItems, 200);
});

// ENDPOINT /stock/:row
export const getItem = factory.createHandlers(async (c: Context) => {
  const Row = Number(c.req.param("row"));

  const sheetReq = await app.request(`/sheet/${Deno.env.get("SPREADSHEET_BACKLOG_ID")}?start_row=${Row}&sheet_name=INVENTÁRIO`);
  console.log(sheetReq)
  if (sheetReq.status !== 200) return c.text("Can not get the backlog sheet", 502);
  const StockItemsReq: StockData[] = await sheetReq.json();

  const colabReq = await app.request(`/collaborators`);
  if (colabReq.status !== 200) return c.text("Can not get the collaborators sheet", 502);
  const Collaborators: CollaboratorsData[] = await colabReq.json();

  const stockItem = StockItemsReq[0];

  let affiliation: CollaboratorsData = { NOME: "", TAG: "", STATUS: "Inativo" }
  for (const colab of Collaborators) {
    if (colab.TAG == stockItem.Afiliação) {
      affiliation = colab;
      break;
    }
  }

  const item: StockItem = {
    row: Row,
    ...stockItem,
    affiliation,
    history: stockItem.Histórico.split(" / "),
  }

  return c.json(item, 200);
});

// ENDPOINT /collaborators
export const getCollaborators = factory.createHandlers(async (c: Context) => {
  const sheetReq = await app.request(
    `/sheet/${Deno.env.get("SPREADSHEET_BACKLOG_ID")
    }?sheet_name=COLABORADORES`,
  );
  if (sheetReq.status !== 200) {
    return c.text("Can not get the calls sheet", 502);
  }
  const Collabs: CollaboratorsData[] = await sheetReq.json();

  return c.json(Collabs, 200);
});