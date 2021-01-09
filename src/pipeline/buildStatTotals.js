import { fetchItemData } from "../dataSource/wowhead";

const statAlias = {
  Haste: "HasteRating",
  Mastery: "MasteryRating",
  "Critical Strike": "CritRating",
};

async function buildStatTotals(itemGroups, targetItemCount) {
  const statTotals = {};

  for (let i = 0; i < itemGroups.length; i++) {
    const slotData = itemGroups[i];
    console.log(" Processing slot: " + slotData.slot);

    let itemCount = 0;
    for (let j = 0; j < slotData.groups.length; j++) {
      const currentGroup = slotData.groups[j];

      console.log(
        "  Fetching items " + JSON.stringify(currentGroup) + " for group " + j
      );

      const items = await Promise.all(currentGroup.map(fetchItemData));

      // legendaries show up as quality 1 without secondary stats on them
      // we'll assume that the player will put whatever their top stats are
      // on the item, so we don't want them to influence the weighting
      const lowValueItems = items.filter((x) => x.quality < 2);
      if (lowValueItems.length) {
        console.log(
          "  Discarding group " +
            j +
            " due to low value items: " +
            JSON.stringify(lowValueItems.map((x) => x.itemId))
        );
        continue;
      }

      items.forEach((itemData) => {
        console.log(
          "   Item " + itemData.itemId + " is " + JSON.stringify(itemData.stats)
        );

        for (const [key, value] of Object.entries(itemData.stats)) {
          const finalKey = statAlias[key] || [key];
          statTotals[finalKey] = (statTotals[finalKey] || 0) + value;
        }
      });

      itemCount += 1;
      if (itemCount >= targetItemCount) {
        break;
      }
    }
  }

  return statTotals;
}

export default buildStatTotals;
