import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as controller from './controller';
import connection from './db/connection';
import * as crawlEmpire from './service/crawlEmpire';
import cors from "cors";
var cron = require('node-cron');

const app: Express = express();

app.use(cors());

const port = 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/crawl_buff_csgo").get(controller.crawlBuffCsgo);
app.route("/crawl_buff_dota").get(controller.crawlBuffDota);
app.route("/crawl_buff_all").get(controller.crawlBuffAll);

// crawl etop page
app.route("/crawl_etop_page_csgo").get(controller.crawlEtopCsgo);
app.route("/crawl_etop_page_dota").get(controller.crawlEtopDota);
app.route("/crawl_etop_page_all").get(controller.crawlEtopAll);

// crawl etop order
app.route("/crawl_etop_order_csgo").get(controller.crawlEtopCsgoOrder);
app.route("/crawl_etop_order_dota").get(controller.crawlEtopDotaOrder);
app.route("/crawl_etop_order_all").get(controller.crawlEtopOrderAll);

// crawl empire
app.route("/crawl_empire").get(controller.crawlEmpire);

app.route("/test").get(controller.test);

cron.schedule('*/5 * * * *', async () => {
  crawlEmpire.crawlEmpireRange1();
  // crawlEmpire.crawlEmpireRange2();
  // crawlEmpire.crawlEmpireRange3();
});

app.listen(port, async () => {
  await connection.sync();
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});