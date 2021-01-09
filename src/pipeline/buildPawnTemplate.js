function buildPawnStatString(statWeights) {
  return (
    "{ " +
    Object.entries(statWeights)
      .map(([x, y]) => x + "=" + y)
      .join(", ") +
    " }"
  );
}

function buildPawnTemplate(classDefinition, statWeights) {
  return [
    "PawnAddPluginScaleFromTemplate(",
    "    ScaleProviderName,",
    `    ${classDefinition.classId}, -- ${classDefinition.className}`,
    `    ${classDefinition.specId}, -- ${classDefinition.specName}`,
    "    " + buildPawnStatString(statWeights),
    ")",
  ].join("\r\n");
}

export default buildPawnTemplate;
