const fs = require("fs");
const ICON_PACKAGE = process.argv[process.argv.length - 1];
const json = require(`@svg-icons/${ICON_PACKAGE}/__manifest.json`);

const icons = json.map((icon) => {
  const { name, ...rest } = icon;
  const svg = fs.readFileSync(
    `./node_modules/@svg-icons/${ICON_PACKAGE}/${name}.svg`,
    { encoding: "utf8", flag: "r" }
  );
  return [name, { svg }];
});

console.log(`export const IconMap = new Map(${JSON.stringify(icons)});`);
