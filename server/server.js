require('dotenv').config();
require('./config/passport.config');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const routes = require('./api/routes/index');
const errorHandlerMiddleware = require('./api/middlewares/error-handler.middleware');

const app = express();
app.use(cors());

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

const staticPath = path.resolve(`${__dirname}/../client/build`);
app.use(express.static(staticPath));
routes(app);

app.get('*', (req, res) => {
  res.write(fs.readFileSync(`${__dirname}/../client/build/index.html`));
  res.end();
});

const port = process.env.APP_PORT || 3000;

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}!`);
});
