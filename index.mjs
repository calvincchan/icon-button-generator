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

import sharp from 'sharp';

async function generateSquareImage() {
  // Set the dimensions of the image
  const width = 400;
  const height = 400;

  // Create a new Sharp image with a red square
  const image = await sharp({
    create: {
      width: width,
      height: height,
      channels: 3, // 3 channels: Red, Green, Blue
      background: { r: 255, g: 0, b: 0 } // Red color
    }
  }).jpeg().toBuffer();

  return image;
}

export const handler = async (event, context) => {
  try {
    const params = event.queryStringParameters();
    const buffer = await generateSquareImage(params);
    return {
      'statusCode': 200,
      'headers': {
        'Content-Type': 'image/jpeg',
        'Content-Length': buffer.length.toString()
      },
      'body': buffer.toString('base64'),
      isBase64Encoded: true
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
