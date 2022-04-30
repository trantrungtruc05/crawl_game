import { Request, Response } from 'express';
import axios from 'axios';
import { ConfigInfo } from '../entity/ConfigInfo';
import { BuffPage } from '../entity/BuffPage';
import connection from '../db/connection';
import { text } from 'body-parser';
import * as handleStatus from './handleStatus';
var cron = require('node-cron');
const { QueryTypes } = require('sequelize');


var buffItemLs: any[] = [];

export let crawlBuff = async (category) => {
    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

    console.log(` CRAWL BUFF ${category}`);

    // update status running when crawl buff start
    await handleStatus.crawl(479682, 'running');

    var proxyLisy = ['45.131.212.199:6248', '45.131.212.96:6145', '45.131.212.239:6288', '45.131.212.154:6203', '45.131.212.54:6103', '45.131.212.147:6196', '45.131.212.134:6183', '45.131.212.230:6279', '45.131.212.8:6057', '45.131.212.223:6272'
        , '45.131.212.243:6292', '45.131.212.110:6159', '45.131.212.139:6188', '45.131.212.116:6165', '45.131.212.164:6213', '45.131.212.196:6245', '45.131.212.250:6299', '45.131.212.228:6277', '45.131.212.240:6289', '45.131.212.211:6260']


    const cookieBuff: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "buff", type: "cookie" } });
    const yuanCurrency: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "yuan", type: "currency" } });

    var totalPageLink = category == 'csgo' ? `https://buff.163.com/api/market/goods?game=csgo&page_num=1&page_size=80&min_price=130&use_suggestion=0&trigger=undefined_trigger&_=${new Date().getTime()}` : `https://buff.163.com/api/market/goods?game=dota2&page_num=1&page_size=80&min_price=10&use_suggestion=0&trigger=undefined_trigger&_=${new Date().getTime()}`;

    var proxy = proxyLisy[Math.floor(Math.random() * proxyLisy.length)];

    var totalPageResult = await axios.get(totalPageLink, {
        proxy: {
            host: `${proxy.split(':')[0]}`,
            port: parseInt(proxy.split(':')[1]),
            auth: { username: 'dmogyuzp', password: 'lx8fr8go05bq' }
        },
        headers: {
            'Cookie': cookieBuff[0].value
        }
    });

    // sleep
    await snooze(4000);

    var totalPageInit = totalPageResult.data.data.total_page;
    var totalPageRealLink = category == 'csgo' ? `https://buff.163.com/api/market/goods?game=csgo&page_num=${totalPageInit}&page_size=80&min_price=130&use_suggestion=0&trigger=undefined_trigger&_=${new Date().getTime()}` : `https://buff.163.com/api/market/goods?game=dota2&page_num=${totalPageInit}&page_size=80&min_price=10&use_suggestion=0&trigger=undefined_trigger&_=${new Date().getTime()}`;

    proxy = proxyLisy[Math.floor(Math.random() * proxyLisy.length)];

    var totalPageRealResult = await axios.get(totalPageRealLink, {
        proxy: {
            host: `${proxy.split(':')[0]}`,
            port: parseInt(proxy.split(':')[1]),
            auth: { username: 'dmogyuzp', password: 'lx8fr8go05bq' }
        },
        headers: {
            'Cookie': cookieBuff[0].value
        }
    });


    // sleep
    await snooze(4000);

    var totalPageReal = totalPageRealResult.data.data.total_page;
    var page = 1;

    console.log(`CRAWL BUF ${category} total page:  ${totalPageReal}`)

    while (page <= totalPageReal) {
        // sleep
        await snooze(4000);

        var currentTime = new Date().getTime();
        var getItemLink = category == 'csgo' ? `https://buff.163.com/api/market/goods?game=csgo&page_num=${page}&page_size=80&min_price=130&use_suggestion=0&trigger=undefined_trigger&_=${currentTime}` : `https://buff.163.com/api/market/goods?game=dota2&page_num=${page}&page_size=80&min_price=10&use_suggestion=0&trigger=undefined_trigger&_=${currentTime}`;

        proxy = proxyLisy[Math.floor(Math.random() * proxyLisy.length)];

        var getItemLinkResult = await axios.get(getItemLink, {
            proxy: {
                host: `${proxy.split(':')[0]}`,
                port: parseInt(proxy.split(':')[1]),
                auth: { username: 'dmogyuzp', password: 'lx8fr8go05bq' }
            },
            headers: {
                'Cookie': cookieBuff[0].value
            }
        });

        console.log(`>>>>>>> crawling Buff with URL ${getItemLink}`);

        for (let i = 0; i < getItemLinkResult.data.data.items.length; i++) {
            var name = getItemLinkResult.data.data.items[i].name;
            var buyMaxPrice = getItemLinkResult.data.data.items[i].buy_max_price;
            var sellMinPrice = getItemLinkResult.data.data.items[i].sell_min_price;

            var priceVnd = parseFloat(buyMaxPrice) * parseFloat(yuanCurrency[0].value);
            var priceSaleVnd = parseFloat(sellMinPrice) * parseFloat(yuanCurrency[0].value);

            console.log(name);

            var item = { name: name, originalPrice: parseFloat(buyMaxPrice), priceByVnd: Math.round(priceVnd - 0.03 * priceVnd), originalPriceByVnd: Math.round(priceVnd), category: `${category}`, originBuffSellPrice: parseFloat(sellMinPrice), buffSellPriceVnd: Math.round(priceSaleVnd), createAt: new Date() };
            buffItemLs.push(item);
        }

        page++;

    }

    if(category === 'csgo'){
        console.log(`Clear table buff with category ${category}`);
        await BuffPage.destroy({ where: {category: "csgo"}});
    }else{
        console.log(`Clear table buff with category ${category}`);
        await BuffPage.destroy({ where: {category: "dota2"}});
    }

    await BuffPage.bulkCreate(buffItemLs);

    await BuffPage.destroy({where: {originalPrice : 0}});

    // get duplicate data
    var duplicate = await connection.query('SELECT name, COUNT(*) dupValue FROM buff_page bp  GROUP BY name HAVING COUNT(*) > 1', { type: QueryTypes.SELECT })
    var buffIdDelete: any[] = [];
    for(let i=0;i<duplicate.length;i++){
        var findNameAsc = await connection.query(`select * from buff_page bp  where bp.name = '${(duplicate[i] as any).name}' and bp.category = '${category}' order by original_price asc`, { replacements: [text], type: QueryTypes.SELECT })

        for(let i=1;i<findNameAsc.length;i++){
            buffIdDelete.push((findNameAsc[i] as any).id);
        }
    }
    
    await BuffPage.destroy({where: {id : buffIdDelete}});
    

    console.log(`Insert DB Buff ${category} done`);

    // update status idle when crawl buff finish
    await handleStatus.crawl(479682, 'idle');

};