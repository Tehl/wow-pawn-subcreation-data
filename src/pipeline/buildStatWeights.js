import statsToCalculate from "../data/targetStats";
import baselineWeights from "../data/baselineWeights";

function safeStatWeight(numerator, denominator) {
  if (!numerator || !denominator) {
    return 0;
  }

  const ratio = numerator / denominator;
  return Math.round((ratio + Number.EPSILON) * 100) / 100;
}

function buildStatWeights(classDefinition, statTotals) {
  const primaryStatValue = statTotals[classDefinition.primaryStat];

  const statWeights = {
    [classDefinition.primaryStat]: baselineWeights.primaryStat,
    ...baselineWeights[classDefinition.role],
  };

  statsToCalculate.forEach(
    (statName) =>
      (statWeights[statName] = safeStatWeight(
        statTotals[statName],
        primaryStatValue
      ))
  );

  return statWeights;
}

export default buildStatWeights;
