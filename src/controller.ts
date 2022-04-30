import { Request, Response } from 'express';
import * as crawlEmpireService from './service/crawlEmpire';
import * as crawlBuffService from './service/crawlBuff';
import * as crawlEtopPageService from './service/crawlEtop';

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

export let crawlBuffAll = async (req, res) => {
    await crawlBuffService.crawlBuff('csgo');
    await crawlBuffService.crawlBuff('dota2');
    return res.status(200).send('crawl_buff_dota2');
};

export let crawlEtopCsgo = async (req, res) => {
    crawlEtopPageService.crawlEtop('csgo');
    return res.status(200).send('crawl_etop_page_csgo');
};

export let crawlEtopDota = async (req, res) => {
    crawlEtopPageService.crawlEtop('dota2');
    return res.status(200).send('crawl_etop_page_dota');
};

export let crawlEtopAll = async (req, res) => {
    await crawlEtopPageService.crawlEtop('csgo');
    await crawlEtopPageService.crawlEtop('dota2');
    return res.status(200).send('crawl_etop_page_all');
};

