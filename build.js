const fs = require("fs");
const buildPackages = require("./build.config.json");

function generateIndexFile(buildPackages) {
  return `export const fontPackages = new Set(${JSON.stringify(
    buildPackages
  )});`;
}

function generateSvgFile(buildPackage) {
  const json = require(`@svg-icons/${buildPackage}/__manifest.json`);
  const icons = json.map((icon) => {
    const { name, ...rest } = icon;
    const svg = fs.readFileSync(
      `./node_modules/@svg-icons/${buildPackage}/${name}.svg`,
      { encoding: "utf8", flag: "r" }
    );
    return [name, { svg }];
  });
  return `export const IconMap = new Map(${JSON.stringify(icons)});`;
}

function main() {
  /** index file */
  fs.writeFileSync("./assets/index.mjs", generateIndexFile(buildPackages));

  /** svg files */
  for (let iconPackage of buildPackages) {
    fs.writeFileSync(
      `./assets/${iconPackage}.mjs`,
      generateSvgFile(iconPackage)
    );
  }
}

main();
