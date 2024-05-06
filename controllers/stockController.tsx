import { createFactory } from "hono/factory";
import { Context } from "hono";
import { app } from "../index.ts";
import { BatchGetValuesResponse } from "sheets";
import { StockData, CollaboratorsData } from "../types/stock.ts";

const factory = createFactory();

// ENDPOINT /stock
export const getStock = factory.createHandlers(async (c: Context) => {
  const sheetReq = await app.request(`/sheet/${Deno.env.get("SPREADSHEET_BACKLOG_ID")}?cells_range=INVENTÁRIO!A3:O450`);
  if (sheetReq.status !== 200) return c.text("Can not get the calls sheet", 502);
  const StockItemsReq: BatchGetValuesResponse = await sheetReq.json();

  const colabReq = await app.request(`/collaborators`);
  if (colabReq.status !== 200) return c.text("Can not get the collaborators sheet", 502);
  const Collaborators: Array<CollaboratorsData> = await colabReq.json();

  const StockItems: StockData[] = StockItemsReq.valueRanges![0].values!.map((item, i) => {
    let affiliation: CollaboratorsData = { name: "", row: 999, status: "Inativo", tag: "" }
    for (const colab of Collaborators) {
      if (colab.tag == item[8]) {
        colab.name = colab.name.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
        affiliation = colab;
        break;
      }
    }
    return {
        row: 3 + i,
        item: item[0],
        model: item[1],
        tag: item[2] + "-" + item[3],
        notes: item[4],
        status: item[5],
        condition: item[6],
        location: item[7],
        affiliation: affiliation,
        historical: item[9],
        oldTag: item[11],
        broken: {
          isBroken: item[6] === "Quebrado",
          date: item[13],
          who: item[12],
        },
        lastUpdate: item[14],
    };
  }).filter((item) => item.item !== "");

  return c.json(StockItems, 200);
});

// ENDPOINT /stock/:row
export const getItem = factory.createHandlers(async (c: Context) => {
  const Row = c.req.param("row");

  const sheetReq = await app.request(`/sheet/${Deno.env.get("SPREADSHEET_BACKLOG_ID")}?cells_range=INVENTÁRIO!A${Row}:O${Row}`);
  if (sheetReq.status !== 200) return c.text("Can not get the calls sheet", 502);
  const StockItemsReq: BatchGetValuesResponse = await sheetReq.json();

  const item = StockItemsReq.valueRanges![0].values![0];

  const StockItems = {
    row: Row,
    item: item[0],
    model: item[1],
    tag: item[2] + "-" + item[3],
    notes: item[4],
    status: item[5],
    condition: item[6],
    location: item[7],
    affiliation: item[8],
    historical: item[9],
    oldTag: item[11],
    broken: {
      isBroken: item[6] === "Quebrado",
      date: item[13],
      who: item[12],
    },
    lastUpdate: item[14],
  };

  return c.json(StockItems, 200);
});

// ENDPOINT /collaborators
export const getCollaborators = factory.createHandlers(async (c: Context) => {
  const sheetReq = await app.request(
    `/sheet/${
      Deno.env.get("SPREADSHEET_BACKLOG_ID")
    }?cells_range=COLABORADORES!A50:C130`,
  );
  if (sheetReq.status !== 200) {
    return c.text("Can not get the calls sheet", 502);
  }
  const CollabsReq: BatchGetValuesResponse = await sheetReq.json();

  const Collabs: CollaboratorsData[] = CollabsReq.valueRanges![0].values!.map(
    (item, i) => {
      return {
        row: 50 + i,
        name: item[0],
        tag: item[1],
        status: item[2]
      };
    },
  ).filter((item) => item.name !== "");

  return c.json(Collabs, 200);
});