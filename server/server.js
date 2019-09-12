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
const { Client } = require('elasticsearch');
const admin = require('firebase-admin');
const { options } = require('./config/aws.config');
const routes = require('./api/routes/index');
const routesWhiteList = require('./config/routes-white-list.config');
const authorizationMiddleware = require('./api/middlewares/authorization.middleware');
const errorHandlerMiddleware = require('./api/middlewares/error-handler.middleware');
const socketHandlers = require('./socket/socket-handlers');
const {
  issuesSocketInjector,
  pullsSocketInjector,
  commitsSocketInjector,
  reposSocketInjector
} = require('./socket/injector');
const { elasticHost, elasticPort, elasticIndex } = require('./config/elastic.config');
const serviceAccount = require('./depot-dc9be-firebase-adminsdk-kbzec-eb0ca888df.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://depot-dc9be.firebaseio.com'
});

const app = express();
app.use(cors());
const socketServer = http.Server(app);
const io = socketIO(socketServer);

const issuesNsp = io.of('/issues').on('connection', socketHandlers);
const pullsNsp = io.of('/pulls').on('connection', socketHandlers);
const commitsNsp = io.of('/commits').on('connection', socketHandlers);
const reposNsp = io.of('/repos').on('connection', socketHandlers);

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', authorizationMiddleware(routesWhiteList));
app.use(issuesSocketInjector(issuesNsp));
app.use(pullsSocketInjector(pullsNsp));
app.use(commitsSocketInjector(commitsNsp));
app.use(reposSocketInjector(reposNsp));

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

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}!`);
});

socketServer.listen(server);

const client = new Client({
  host: elasticHost,
  port: elasticPort
});

const init = async () => {
  await client.indices.create({
    index: elasticIndex,
    body: {
      mappings: {
        properties: {
          type: { type: 'keyword' },
          username: { type: 'text' },
          reponame: { type: 'text' }
        }
      }
    }
  });
};

client.indices.exists(
  {
    index: elasticIndex
  },
  (error, exists) => {
    if (!exists) {
      init();
      console.warn(`Index ${elasticIndex} was created`);
    } else {
      console.warn('Index already exists, not creating again');
    }
  }
);
