import { Request, Response } from 'express';
import * as crawlEmpireService from './service/crawlEmpire';
import * as crawlBuffService from './service/crawlBuff';

export let crawlEmpire = async (req, res) => {
    crawlEmpireService.crawlEmpire();
    return res.status(200).send('crawl_empire');
};

export let crawlBuffCsgo = async (req, res) => {
    crawlBuffService.crawlBuff('csgo');
    return res.status(200).send('crawl_buff_csgo');
};

export let crawlBuffDota = async (req, res) => {
    crawlBuffService.crawlBuff('dota2');
    return res.status(200).send('crawl_buff_dota2');
};