const https = require('https');
https.get('https://ttonger98.github.io/zometool-h5/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data); });
});
