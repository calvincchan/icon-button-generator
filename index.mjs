/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

import assert from "assert";
import sharp from "sharp";
import { fontPackages } from "./assets/index.mjs";

function generateSvg(iconMap, iconName, size, zoom, background, color) {
  const svgImageSize = `${100 * zoom}%`;
  const svgImageOffset = `${(100 - 100 * zoom) / 2}%`;
  const innerSvg = iconMap.get(iconName).svg || "<svg></svg>";
  const innerSvg2 = innerSvg.replace(
    "<svg ",
    `<svg width="${svgImageSize}" height="${svgImageSize}" x="${svgImageOffset}" y="${svgImageOffset}" `
  );
  return `<?xml version="1.0" encoding="utf-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="${size}" width="${size}">
  <rect fill="#${background}" height="100%" width="100%" />
  <g color="#${color}">${innerSvg2}</g>
  </svg>`;
}

async function generateIconImage(params) {
  const {
    size = 400,
    package: packageName = "fa-regular",
    icon: iconName = "star",
    zoom = 1,
    background = "FF6600",
    color = "00000077",
  } = params;

  /** Assert the icon package and icon name are valid */
  assert(
    fontPackages.has(packageName),
    `Unknown font package "${packageName}"`
  );
  const { IconMap } = await import(`./assets/${packageName}.mjs`);
  assert(
    IconMap.has(iconName),
    `Icon name "${iconName}" not found in "${packageName}"`
  );

  /** Fetch the icon from the sprite */
  const svg = generateSvg(IconMap, iconName, size, zoom, background, color);
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

/** Generate a full map of all icon packages and the correponding icon names. */
async function generateFullMap() {
  const packages = [...fontPackages.keys()];
  const result = [];
  for (const packageName of packages) {
    const { IconMap } = await import(`./assets/${packageName}.mjs`);
    result.push({
      package: packageName,
      icons: [...IconMap.keys()],
    });
  }
  return result;
}

export const handler = async (event, context) => {
  try {
    const params = event?.queryStringParameters || { docMode: true };
    if (params.docMode) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(await generateFullMap()),
      };
    } else {
      if (params.size) {
        params.size = parseInt(params.size) || 400;
      }
      if (params.zoom) {
        params.zoom = parseFloat(params.zoom) || 1;
        if (params.zoom > 1) {
          params.zoom = 1.0;
        } else if (params.zoom < 0.5) {
          params.zoom = 0.5;
        }
      }
      const buffer = await generateIconImage(params);

      // save buffer to local file
      if (process.env.DEV === "yes") {
        const result = await sharp(buffer).toFile(`./output.png`);
        return result;
      } else {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "image/jpeg",
            "Content-Length": buffer.length.toString(),
          },
          body: buffer.toString("base64"),
          isBase64Encoded: true,
        };
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};

if (process.env.DEV === "yes") {
  console.log(
    /** Test no params */
    await handler({})

    /** Test with params */
    // await handler({
    //   queryStringParameters: {
    //     package: "feather",
    //     icon: "aperture",
    //     size: "300",
    //     zoom: "0.5",
    //     background: "FF6600",
    //     color: "000000",
    //   },
    // })
  );
}
