import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as controller from './controller';
import connection from './db/connection';
import * as https from 'https';
import * as crawlBuffService from './service/crawlBuff';

var cron = require('node-cron');

const app: Express = express();
const port = 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/crawl_buff_csgo").get(controller.crawlBuffCsgo);
app.route("/crawl_buff_dota").get(controller.crawlBuffDota);

// start cron job
cron.schedule('* * */24 * * *', async () => {
  await crawlBuffService.crawlBuff('csgo');
  await crawlBuffService.crawlBuff('dota');
});

app.listen(port, async () => {
  await connection.sync();
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});