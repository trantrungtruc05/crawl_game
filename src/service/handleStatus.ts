import { Request, Response } from 'express';
import axios from 'axios';
import { CronJobLog } from '../entity/CronJobLog';


export let crawl = async (id, status) => {

    await CronJobLog.update(
        {status: status},
        {where: { id: id }}
    )

    console.log(`Update status: ${status} crawl success`);


};