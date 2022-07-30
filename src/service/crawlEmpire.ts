import { Request, Response } from 'express';
import axios from 'axios';
import { ConfigInfo } from '../entity/ConfigInfo';
import { EmpirePage } from '../entity/EmpirePage';
import connection from '../db/connection';
const { QueryTypes } = require('sequelize');

export let crawlEmpireRange1 = async () => {

    try {
        console.log(` start ${new Date()}`)

        const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
        var empireItemLs: any[] = [];

        const cookie: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: 'asimovet1', type: "empire_crawl" } });
        const empirePricing: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "empire", type: "currency" } });

        var page = 1;
        var data;

        do {
            var cookieRandom = cookie[Math.floor(Math.random() * cookie.length)];
            console.log(`crawling empire page ${page} with cookie ${cookieRandom.key} `);
            var link = `https://csgoempire.com/api/v2/trading/items?per_page=2500&page=${page}&price_min=10000&price_max=1500000&auction=yes&price_max_above=15&sort=desc&order=market_value`;
            var result = await axios.get(link, {

                headers: {
                    'content-type': 'application/json',
                    'Cookie': cookieRandom.value
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

                var empire = { name: marketname, originalPrice: realMarketValue, priceByVnd: Math.round(priceByVnd), itemId: itemId, originalPriceNotPercentage: marketValue / 100, createAt: new Date(), range: 1 };
                empireItemLs.push(empire);


            }

            page++;
            // sleep
            await snooze(1000);

            // } while (data.length > 0)
        } while (page < 4)

        // delete with range = 1
        await EmpirePage.destroy({ where: { range: 1 } });

        // insert data
        await EmpirePage.bulkCreate(empireItemLs);

        var specialChar = await connection.query(`select * from empire_page  where name like '%Sticker%'`);
        var empireSpecialCharDel: any[] = [];
        for (let i = 0; i < specialChar.length; i++) {
            empireSpecialCharDel.push((specialChar[i] as any).id);
        }
        await EmpirePage.destroy({ where: { id: empireSpecialCharDel } });

        console.log(`Insert DB Empire done`);
        console.log(` end ${new Date()}`)
    } catch (e) {
        console.log('Cookie toang roi');
    }
};


export let crawlEmpireRange2 = async () => {

    console.log(' CRAWL EMPIRE RANGE 2 ');
    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    var empireItemLs: any[] = [];

    const cookie: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "beaverK25", type: "empire_crawl" } });
    const empirePricing: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "empire", type: "currency" } });

    var page = 4;
    var data;

    do {
        var cookieRandom = cookie[Math.floor(Math.random() * cookie.length)];
        console.log(`crawling empire page ${page} with cookie ${cookieRandom.key} `);
        var link = `https://csgoempire.com/api/v2/trading/items?per_page=2500&page=${page}&price_max=1500000&auction=yes&price_max_above=15&sort=desc&order=market_value`;
        var result = await axios.get(link, {

            headers: {
                'content-type': 'application/json',
                'Cookie': cookieRandom.value
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

            var empire = { name: marketname, originalPrice: realMarketValue, priceByVnd: Math.round(priceByVnd), itemId: itemId, originalPriceNotPercentage: marketValue / 100, createAt: new Date(), range: 2 };
            empireItemLs.push(empire);


        }

        page++;
        // sleep
        await snooze(1000);

        // } while (data.length > 0)
    } while (page < 7)

    // delete with range = 2
    await EmpirePage.destroy({ where: { range: 2 } });

    // insert data
    await EmpirePage.bulkCreate(empireItemLs);

    // process data after insert
    // var duplicate = await connection.query('SELECT name, COUNT(*) dupValue FROM empire_page ep  GROUP BY name HAVING COUNT(*) > 1', { type: QueryTypes.SELECT });
    // var empireIdDelete: any[] = [];
    // for(let i=0;i<duplicate.length;i++){
    //     var name = (duplicate[i] as any).name;
    //     var findNameAsc = await connection.query(`select * from empire_page ep  where ep.name = :name order by original_price_not_percentage asc`,  { replacements: {name}, type: QueryTypes.SELECT })

    //     for(let i=1;i<findNameAsc.length;i++){
    //         empireIdDelete.push((findNameAsc[i] as any).id);
    //     }
    // }

    // await EmpirePage.destroy({where: {id : empireIdDelete}});

    var specialChar = await connection.query(`select * from empire_page  where name like '%Sticker%'`);
    var empireSpecialCharDel: any[] = [];
    for (let i = 0; i < specialChar.length; i++) {
        empireSpecialCharDel.push((specialChar[i] as any).id);
    }
    await EmpirePage.destroy({ where: { id: empireSpecialCharDel } });

    console.log(`Insert DB Empire done`);





};


export let crawlEmpireRange3 = async () => {

    console.log(' CRAWL EMPIRE RANGE 3 ');
    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    var empireItemLs: any[] = [];

    const cookie: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "manuciant11", type: "empire_crawl" } });
    const empirePricing: ConfigInfo[] = await ConfigInfo.findAll({ where: { key: "empire", type: "currency" } });

    var page = 7;
    var data;

    do {
        var cookieRandom = cookie[Math.floor(Math.random() * cookie.length)];
        console.log(`crawling empire page ${page} with cookie ${cookieRandom.key} `);
        var link = `https://csgoempire.com/api/v2/trading/items?per_page=2500&page=${page}&price_max=1500000&auction=yes&price_max_above=15&sort=desc&order=market_value`;
        var result = await axios.get(link, {

            headers: {
                'content-type': 'application/json',
                'Cookie': cookieRandom.value
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

            var empire = { name: marketname, originalPrice: realMarketValue, priceByVnd: Math.round(priceByVnd), itemId: itemId, originalPriceNotPercentage: marketValue / 100, createAt: new Date(), range: 3 };
            empireItemLs.push(empire);


        }

        page++;
        // sleep
        await snooze(1000);

        // } while (data.length > 0)
    } while (page < 10)

    // delete with range = 3
    await EmpirePage.destroy({ where: { range: 3 } });

    // insert data
    await EmpirePage.bulkCreate(empireItemLs);

    // process data after insert
    // var duplicate = await connection.query('SELECT name, COUNT(*) dupValue FROM empire_page ep  GROUP BY name HAVING COUNT(*) > 1', { type: QueryTypes.SELECT });
    // var empireIdDelete: any[] = [];
    // for(let i=0;i<duplicate.length;i++){
    //     var name = (duplicate[i] as any).name;
    //     var findNameAsc = await connection.query(`select * from empire_page ep  where ep.name = :name order by original_price_not_percentage asc`,  { replacements: {name}, type: QueryTypes.SELECT })

    //     for(let i=1;i<findNameAsc.length;i++){
    //         empireIdDelete.push((findNameAsc[i] as any).id);
    //     }
    // }

    // await EmpirePage.destroy({where: {id : empireIdDelete}});

    var specialChar = await connection.query(`select * from empire_page  where name like '%Sticker%'`);
    var empireSpecialCharDel: any[] = [];
    for (let i = 0; i < specialChar.length; i++) {
        empireSpecialCharDel.push((specialChar[i] as any).id);
    }
    await EmpirePage.destroy({ where: { id: empireSpecialCharDel } });

    console.log(`Insert DB Empire done`);





};