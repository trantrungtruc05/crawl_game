import { Request, Response } from 'express';
import { ConfigInfo } from '../entity/ConfigInfo';
import { EtopPage } from '../entity/EtopPage';
import * as handleStatus from './handleStatus';
import * as callApi from './callApi';
import * as mailService from './mailService';


export let crawlEtop = async (category) => {
    console.log(`CRAWL ${category}`);

    await handleStatus.crawl(503899, 'running');

    var proxyLisy = ['45.131.212.199:6248', '45.131.212.96:6145', '45.131.212.239:6288', '45.131.212.154:6203', '45.131.212.54:6103', '45.131.212.147:6196', '45.131.212.134:6183', '45.131.212.230:6279', '45.131.212.8:6057', '45.131.212.223:6272'
        , '45.131.212.243:6292', '45.131.212.110:6159', '45.131.212.139:6188', '45.131.212.116:6165', '45.131.212.164:6213', '45.131.212.196:6245', '45.131.212.250:6299', '45.131.212.228:6277', '45.131.212.240:6289', '45.131.212.211:6260']

    var proxy = proxyLisy[Math.floor(Math.random() * proxyLisy.length)];
    console.log(`Using proxy to crawl ${category}` + proxy);

    const cookieEtopCrawl: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "etop_crawl", type: "cookie" } });
    const etopCurrency: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "etop", type: "currency" } });

    var totalPageLink = category == 'csgo' ? 'https://www.etopfun.com/api/schema/bcitemlist.do?appid=730&rows=60&page=1&quality=&rarity=&exterior=&lang=en' : 'https://www.etopfun.com/api/schema/bcitemlist.do?appid=570&rows=60&page=1&quality=&rarity=&exterior=&lang=en';

    var result = await callApi.apiWithProxy(category, proxy, totalPageLink, cookieEtopCrawl);
    if(result.status === 'fail'){
        return;
    }

    var totalPage = result.data.datas.pager.pages;
    console.log(`Crawl etop page with size: ${totalPage}`);

    if (result.data === '') {
        console.log('failed');
    } else {
        var page = 1;
        var etopItemLs: any[] = [];
        while (page <= totalPage) {
            var getItemLink = category == "csgo" ? `https://www.etopfun.com/api/schema/bcitemlist.do?appid=730&rows=60&page=${page}&hero=&quality=&rarity=&lang=en` : `https://www.etopfun.com/api/schema/bcitemlist.do?appid=570&rows=60&page=${page}&hero=&quality=&rarity=&lang=en`;
            
            var resultGetItem = await callApi.apiWithProxy(category, proxy, getItemLink, cookieEtopCrawl);
            if(resultGetItem.status === 'fail'){
                return;
            }

            console.log(`>>>>>>> crawling etop item with page: ${page} with link ${getItemLink}`);

            for (let i = 0; i < resultGetItem.data.datas.list.length; i++) {
                var priceByVnd = resultGetItem.data.datas.list[i].value * parseInt(etopCurrency[0].value);
                var item = { createAt: new Date(), name: resultGetItem.data.datas.list[i].pop.topName.tag, originalPrice: resultGetItem.data.datas.list[i].value, priceByVnd: Math.round(priceByVnd), category: category };
                etopItemLs.push(item);

            }

            page++;
        }

        if (category === 'csgo') {
            await EtopPage.destroy({ where: { category: 'csgo' } });
            await EtopPage.bulkCreate(etopItemLs);
        } else {
            await EtopPage.destroy({ where: { category: 'dota2' } });
            await EtopPage.bulkCreate(etopItemLs);
        }

        const { Op } = require("sequelize");
        await EtopPage.destroy({
            where: {
                originalPrice: {
                    [Op.lt]: 30
                }
            }
        });

        console.log(`Insert DB ${category} done`);

        await handleStatus.crawl(503899, 'idle');

        // send mail
        mailService.send(`Crawl thành công Etop ${category}`, `Crawl thành công Etop ${category} vào lúc ${new Date()}`);


    }
};