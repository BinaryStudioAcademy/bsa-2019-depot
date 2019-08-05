import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import passport from 'passport';

import routes from './api/routes/index';
import './config/passport.config';

dotenv.config();

const app = express();

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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}!`);
});
