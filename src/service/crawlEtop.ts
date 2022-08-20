import { Request, Response } from 'express';
import { ConfigInfo } from '../entity/ConfigInfo';
import { EtopPage } from '../entity/EtopPage';
import * as handleStatus from './handleStatus';
import * as callApi from './callApi';
import * as mailService from './mailService';
import { parse } from 'path';


export let crawlEtop = async (category, type) => {

    var retry = 0;

    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    console.log(`CRAWL ETOP ${type} with ${category}`);

    await handleStatus.crawl(503899, 'running');

    var proxyLisy = ['84.21.191.238:7773', '193.8.94.225:9270', '185.199.228.220:7300', '185.199.231.45:8382', '188.74.210.21:6100', '45.155.68.129:8133', '185.199.229.156:7492', '84.21.191.193:7728', '45.95.99.52:7612', '45.95.99.98:7658']

    var proxy = proxyLisy[Math.floor(Math.random() * proxyLisy.length)];
    console.log(`Using proxy to crawl ${category}` + proxy);

    const cookieEtopCrawl: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "etop_crawl", type: "cookie" } });
    const etopCurrency: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "etop", type: "currency" } });

    var totalPageLink = linkByType(category, type, 1);

    var result = await callApi.apiWithProxy(category, proxy, totalPageLink, cookieEtopCrawl);
    if (result.status === 'fail') {
        retry++;
        if (retry <= 4) {
            crawlEtop(category, type);
        } else {
            // send mail
            mailService.send(`Crawl THẤT BẠI ${category}`, `Crawl THẤT BẠI ${category} lần thứ ${retry} vào lúc ${new Date()} - link ${totalPageLink} - lỗi ${result.data} `);
            return;
        }
    }

    var totalPage = result.data.datas.pager.pages;
    console.log(`Crawl etop ${type} page ${category} with size: ${totalPage}`);

    if (result.data === '') {
        console.log('failed');
    } else {
        var page = 1;
        var etopItemLs: any[] = [];
        while (page <= totalPage) {
            var getItemLink = linkByType(category, type, page);

            var resultGetItem = await callApi.apiWithProxy(category, proxy, getItemLink, cookieEtopCrawl);
            if (resultGetItem.status === 'fail') {
                retry++;
                if (retry <= 4) {
                    crawlEtop(category, type);
                } else {
                    // send mail
                    mailService.send(`Crawl THẤT BẠI ${category}`, `Crawl THẤT BẠI ${category} lần thứ ${retry} vào lúc ${new Date()} - link ${getItemLink} - lỗi ${result.data} `);
                    return;
                }
            }

            console.log(`>>>>>>> crawling etop ${type} item ${category} with page: ${page} with link ${getItemLink}`);

            for (let i = 0; i < resultGetItem.data.datas.list.length; i++) {
                var priceByVnd = resultGetItem.data.datas.list[i].value * parseInt(etopCurrency[0].value);
                var item = { createAt: new Date(), name: resultGetItem.data.datas.list[i].pop.topName.tag, originalPrice: resultGetItem.data.datas.list[i].value, priceByVnd: Math.round(priceByVnd), category: category, slot: resultGetItem.data.datas.list[i].leftSlot, type: type };
                etopItemLs.push(item);

            }

            page++;
            // sleep
            if (type === 'page') {
                await snooze(1000);
            } else {
                await snooze(3000);    
            }
            
        }

        await EtopPage.destroy({ where: { category: category, type: type } });
        await EtopPage.bulkCreate(etopItemLs);

        const { Op } = require("sequelize");
        await EtopPage.destroy({
            where: {
                originalPrice: {
                    [Op.lt]: 20
                }
            }
        });

        console.log(`Insert DB Etop ${type} with ${category} done`);

        await handleStatus.crawl(503899, 'idle');

        // send mail
        mailService.send(`Crawl thành công Etop ${type} with ${category}`, `Crawl thành công Etop ${type} with ${category} vào lúc ${new Date()}`);


    }
};



export let linkByType = (category, type, page) => {
    var link;
    if (type === 'page') {
        link = category === 'csgo' ? 'https://www.etopfun.com/api/schema/bcitemlist.do?appid=730&rows=60&page=' + page + '&hero=&quality=&rarity=&lang=en' : 'https://www.etopfun.com/api/schema/bcitemlist.do?appid=570&rows=60&page=' + page + '&quality=&rarity=&exterior=&lang=en';
    } else {
        link = category === 'csgo' ? 'https://www.etopfun.com/api/ingotitems/realitemback/orderlist.do?appid=730&page=' + page + '&rows=60&mark_name=&lang=en' : 'https://www.etopfun.com/api/ingotitems/realitemback/orderlist.do?appid=570&page=' + page + '&rows=60&mark_name=&lang=en';
    }

    return link;
};