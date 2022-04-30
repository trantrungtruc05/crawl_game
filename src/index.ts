import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as controller from './controller';
import connection from './db/connection';
import * as https from 'https';
import * as crawlBuffService from './service/crawlBuff';
import * as crawlEtopPageService from './service/crawlEtop';

var cron = require('node-cron');

const app: Express = express();
const port = 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.route("/crawl_buff_csgo").get(controller.crawlBuffCsgo);
app.route("/crawl_buff_dota").get(controller.crawlBuffDota);
app.route("/crawl_buff_all").get(controller.crawlBuffAll);
app.route("/crawl_etop_page_csgo").get(controller.crawlEtopCsgo);
app.route("/crawl_etop_page_dota").get(controller.crawlEtopDota);
app.route("/crawl_etop_page_all").get(controller.crawlEtopAll);


// start cron job
cron.schedule('0 0 0 * * *', async () => {
  await crawlBuffService.crawlBuff('csgo');
  await crawlBuffService.crawlBuff('dota');
});

cron.schedule('0 0 23 * * *', async () => {
  await crawlEtopPageService.crawlEtop('csgo');
  await crawlEtopPageService.crawlEtop('dota2');
});

app.listen(port, async () => {
  await connection.sync();
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});