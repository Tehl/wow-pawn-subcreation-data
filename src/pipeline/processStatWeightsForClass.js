import { fetchItemGroupsForClass } from "../dataSource/subcreation";
import buildStatTotals from "./buildStatTotals";
import buildStatWeights from "./buildStatWeights";

async function processStatWeightsForClass(
  classDefinition,
  dataType,
  targetItemCount
) {
  const classTitle =
    classDefinition.className + " (" + classDefinition.specName + ")";
  console.log("Processing " + dataType + " stat weights for " + classTitle);

  const itemGroups = await fetchItemGroupsForClass(
    classDefinition.dataUrls[dataType]
  );

  const statTotals = await buildStatTotals(itemGroups, targetItemCount);

  console.log(
    " Calculated stat totals for " +
      classTitle +
      " across top " +
      targetItemCount +
      " items using " +
      dataType +
      " data:"
  );
  console.log("  " + JSON.stringify(statTotals));

  const statWeights = buildStatWeights(classDefinition, statTotals);

  console.log(" Derived stat weights:");
  console.log("  " + JSON.stringify(statWeights));

  return statWeights;
}

export default processStatWeightsForClass;
