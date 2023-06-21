const https = require('https');

function fetch() {
  return new Promise((resolve, reject) => {
    https.get('https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/search/default/48px.svg', (res) => {
      let data = [];

      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => {
        const output = Buffer.concat(data);
        resolve(output);
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

fetch().then(console.log).finally(() => {});