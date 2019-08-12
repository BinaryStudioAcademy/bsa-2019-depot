require('dotenv').config();
require('./config/passport.config');
const express = require('express');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const routes = require('./api/routes/index');
const routesWhiteList = require('./config/routes-white-list.config');
const authorizationMiddleware = require('./api/middlewares/authorization.middleware');
const errorHandlerMiddleware = require('./api/middlewares/error-handler.middleware');

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use('/api/', authorizationMiddleware(routesWhiteList));

const staticPath = path.resolve(`${__dirname}/../client/build`);
app.use(express.static(staticPath));
routes(app);

app.get('*', (req, res) => {
  res.write(fs.readFileSync(`${__dirname}/../client/build/index.html`));
  res.end();
});

const port = process.env.APP_PORT || 3000;

app.use(errorHandlerMiddleware);

app.listen(port);
console.warn(`Server listening at port ${port}`);
