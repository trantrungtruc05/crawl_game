import { Request, Response } from 'express';
import axios from 'axios';
import * as mailService from './mailService';

export let apiWithProxy = async (category, proxy, link, cookie) => {
    try {
        var result = await axios.get(link, {
            proxy: {
                host: `${proxy.split(':')[0]}`,
                port: parseInt(proxy.split(':')[1]),
                auth: { username: 'dmogyuzp', password: 'lx8fr8go05bq' }
            },
            headers: {
                'Cookie': cookie[0].value
            }
        });

        return result;  
    } catch (e) {
        console.log(`${e}`);
        console.log(`Error when call api crawl with ${category}`);
        return { data: `error: ${e}`, status: "fail" };
    }
};

export let apiNoProxy = async (category, link, cookie) => {
    try {
        var result = await axios.get(link, {
            headers: {
                'Cookie': cookie[0].value
            }
        });

        return result;  
    } catch (e) {
        console.log(`${e}`);
        console.log(`Error when call api crawl with ${category}`);
        return { data: `error: ${e}`, status: "fail" };
    }
};