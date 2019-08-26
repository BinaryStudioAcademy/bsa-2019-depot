const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.get('/raw/:repoId/:branchName/file', (req, res) => {
  res.write(fs.readFileSync(`${__dirname}/raw.html`));
  res.end();
});
const port = process.env.APP_PORT || 3002;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}!`);
});
