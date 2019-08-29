require('dotenv').config();
require('./config/passport.config');
const express = require('express');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const uppy = require('@uppy/companion');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const { options } = require('./config/aws.config');
const routes = require('./api/routes/index');
const routesWhiteList = require('./config/routes-white-list.config');
const authorizationMiddleware = require('./api/middlewares/authorization.middleware');
const errorHandlerMiddleware = require('./api/middlewares/error-handler.middleware');
const issuesSocketHandlers = require('./socket/issues-socket-handlers');
const socketInjector = require('./socket/injector');

const app = express();
app.use(cors());
const socketServer = http.Server(app);
const io = socketIO(socketServer);

const issuesNsp = io.of('/issues');
const commitsNsp = io.of('/commits');

issuesNsp.on('connection', issuesSocketHandlers);

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', authorizationMiddleware(routesWhiteList));
app.use(socketInjector(io));

const staticPath = path.resolve(`${__dirname}/../client/build`);
app.use(express.static(staticPath));
routes(app);
app.use(uppy.app(options));
routes(app, io);
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

socketServer.listen(3002);
