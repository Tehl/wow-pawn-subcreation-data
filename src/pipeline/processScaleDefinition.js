import processStatWeightsForClass from "./processStatWeightsForClass";
import buildPawnTemplate from "./buildPawnTemplate";

const registerScale = `
if not VgerCore.IsClassic then
    PawnAddPluginScaleProvider(ScaleProviderName, ScaleProviderUIName, AddScales)
else
    AddScales = nil
end
`;

async function processScaleDefinition(
  scaleDefinition,
  classDefinitions,
  targetItemCount
) {
  const classTemplates = [];

  for (let i = 0; i < classDefinitions.length; i++) {
    const classDefinition = classDefinitions[i];

    const statWeights = await processStatWeightsForClass(
      classDefinition,
      scaleDefinition.dataType,
      targetItemCount
    );

    const classPawnTemplate = buildPawnTemplate(classDefinition, statWeights);

    classTemplates.push(classPawnTemplate);
  }

  return [
    scaleDefinition.metadata.replace(
      "{date}",
      new Date().toISOString().split("T")[0]
    ),
    "",
    `local ScaleProviderName = "${scaleDefinition.scaleProviderName}"`,
    `local ScaleProviderUIName = "${scaleDefinition.scaleProviderUIName}"`,
    "",
    "local function AddScales()",
    classTemplates
      .map(
        (x) =>
          x
            .split("\r\n")
            .map((y) => "    " + y)
            .join("\r\n") + "\r\n"
      )
      .join("\r\n"),
    "    AddScales = nil",
    "end",
    "",
    registerScale,
  ].join("\r\n");
}

export default processScaleDefinition;
