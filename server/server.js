import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const staticPath = path.resolve(`${__dirname}/../client/build`);
app.use(express.static(staticPath));

app.get('*', (req, res) => {
    res.write(fs.readFileSync(`${__dirname}/../client/build/index.html`));
    res.end();
});

app.listen(process.env.APP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${process.env.APP_PORT}!`);
});
