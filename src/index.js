import fs from "fs";

import processScaleDefinition from "./pipeline/processScaleDefinition";
import scaleDefinitions from "./data/scaleDefinitions";
import classDefinitions from "./data/classDefinitions";

const targetItemCount = 2;

(async () => {
  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }

  for (let i = 0; i < scaleDefinitions.length; i++) {
    const scaleDefinition = scaleDefinitions[i];

    console.log("Processing scale " + scaleDefinition.scaleProviderName);

    const scaleContent = await processScaleDefinition(
      scaleDefinition,
      classDefinitions,
      targetItemCount
    );

    fs.writeFileSync(
      "./output/" + scaleDefinition.scaleProviderName + ".lua",
      scaleContent
    );

    console.log("Wrote " + scaleDefinition.scaleProviderName + ".lua");
  }

  console.log("Done!");
})();
