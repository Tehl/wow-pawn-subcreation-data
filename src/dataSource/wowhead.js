import got from "got";

const wowheadTooltipUrl = "https://www.wowhead.com/tooltip/item/";

function findStatStrings(tooltip) {
  return [...tooltip.matchAll(/<!--stat.+?-->(.+?)<\/span>/g)].map((x) => x[1]);
}

function findRatingStrings(tooltip) {
  return [...tooltip.matchAll(/<!--rtg.+?-->(.+?)<\/span>/g)].map((x) => x[1]);
}

function parseTooltip(tooltip) {
  const statStrings = [
    ...findStatStrings(tooltip),
    ...findRatingStrings(tooltip),
  ];
  const itemStats = {};
  statStrings.forEach((statString) => {
    const splitIdx = statString.indexOf(" ");

    const numPart = statString.substring(0, splitIdx);
    const statValue = parseInt(numPart, 10);

    const statNames = statString.substring(splitIdx + 1);
    statNames
      .split(" or ")
      .map((x) => x.replace(/[\[\]]/g, "").trim())
      .forEach((statName) => (itemStats[statName] = statValue));
  });
  return itemStats;
}

async function fetchItemData(itemId) {
  const httpResponse = await got(wowheadTooltipUrl + itemId);
  const jsonResponse = JSON.parse(httpResponse.body);

  return {
    itemId,
    quality: jsonResponse.quality,
    stats: parseTooltip(jsonResponse.tooltip),
  };
}

export { fetchItemData };
