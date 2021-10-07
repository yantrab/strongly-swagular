import { json2ts } from "json-ts";
import { readdirSync, readFile } from "fs";
import { dirname } from "path";
import { writeFileSync, mkdirSync } from "fs";

const checkKeys = (a: any, b: any, path = ""): void => {
  const aData = a.data;
  const bData = b.data;
  if (!aData) console.warn("missing key :" + path + " in file " + a.name);
  if (!bData) console.warn("missing key :" + path + " in file " + b.name);
  else if (typeof aData === "object")
    return Object.keys(aData).forEach(key =>
      checkKeys({ name: a.name, data: aData[key] }, { name: b.name, data: bData[key] }, path + "." + key)
    );
};

export const generateInterfaces = (sourceFolder: string, dest: string) => {
  const fileNames = readdirSync(sourceFolder);
  Promise.all(
    fileNames.map(
      name => new Promise<string>(resolve => readFile(`${sourceFolder}/${name}`, "utf8", (err, data) => resolve(data)))
    )
  ).then((all: string[]) => {
    const jsons = all.map(f => JSON.parse(f as any));

    // validate keys
    for (let i = 1; i < jsons.length; i++) {
      checkKeys({ name: fileNames[0], data: jsons[0] }, { name: fileNames[i], data: jsons[i] });
      checkKeys({ name: fileNames[i], data: jsons[i] }, { name: fileNames[0], data: jsons[0] });
    }

    // generate interfaces
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, json2ts(all[0]).replace(/interface/g, "export interface"));
  });
};
generateInterfaces("client/src/assets/locale", "shared/locale.interface.ts");
