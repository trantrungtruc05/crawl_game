import { Request, Response } from 'express';
import axios from 'axios';
import { ConfigInfo } from '../entity/ConfigInfo';
import { EmpirePage } from '../entity/EmpirePage';
var cron = require('node-cron');

export let crawlEmpire = async () => {

    console.log(' CRAWL EMPIRE ');
    var empireItemLs: any[] = [];

    const cookie: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "empire_crawl", type: "cookie" } });
    const empirePricing: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "empire", type: "currency" } });

    var page = 1;
    var data;

    do {
        console.log(`crawling page ${page}`);

        var link = `https://csgoempire.com/api/v2/trading/items?per_page=160&page=${page}&price_min=1000&price_max_above=999999&sort=desc&order=market_value`;
        var result = await axios.get(link, {
            headers: {
                'content-type': 'application/json',
                'Cookie': cookie[0].value
            }
        });

        data = result.data.data;
        for (let i = 0; i < data.length; i++) {
            var marketname = data[i].market_name;
            var marketValue = data[i].market_value;
            var itemId = data[i].id;

            var realMarketValue;
            if (!data[i].custom_price_percentage) {
                realMarketValue = marketValue / 100;
            } else {
                var percent = data[i].custom_price_percentage - 6;
                realMarketValue = (marketValue / 100) / (100 + percent) * 100;
            }

            var priceByVnd = realMarketValue * parseInt(empirePricing[0].value);

            var empire = { name: marketname, originalPrice: realMarketValue, priceByVnd: Math.round(priceByVnd), itemId: itemId, originalPriceNotPercentage: marketValue / 100, createAt: new Date() };
            empireItemLs.push(empire);


        }

        page++;

    // } while (data.length > 0)
        } while (page < 5)

    await EmpirePage.destroy({ where: {}, truncate: true });
    await EmpirePage.bulkCreate(empireItemLs);
    console.log(`Insert DB Empire done`);



};