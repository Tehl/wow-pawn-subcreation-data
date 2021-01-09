import got from "got";
import { JSDOM } from "jsdom";

const wowheadItemUrl = "https://www.wowhead.com/item=";

const slots = [
  "head",
  "neck",
  "shoulders",
  "back",
  "chests",
  "wrists",
  "hands",
  "waists",
  "legs",
  "feet",
  "rings",
  "weapons",
];

function parseItemRow(row) {
  const itemLinks = [
    ...row.querySelectorAll('a[href^="' + wowheadItemUrl + '"]'),
  ];

  return itemLinks
    .map((x) => x.href.substring(wowheadItemUrl.length))
    .filter((x) => x !== "0"); // if 2h weapon, offhand is presented with id 0
}

function parseItemGroups(dom, slot) {
  const rows = [
    ...dom.window.document.querySelectorAll(
      "#table-spec-" + slot + " tbody tr"
    ),
  ];

  return rows.map(parseItemRow);
}

async function fetchItemGroupsForClass(classUrl) {
  const httpResponse = await got(classUrl);
  const dom = new JSDOM(httpResponse.body);

  return slots.map((slot) => ({
    slot,
    groups: parseItemGroups(dom, slot),
  }));
}

export { fetchItemGroupsForClass };
