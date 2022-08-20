import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export let send = async (subject, content) => {
    try {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'kyrgiostran@gmail.com',
                pass: 'kpwqdmgvkjwxobhm'
            }
        });
    
        var mailOptions = {
            from: 'kyrgiostran@gmail.com',
            to: 'hotrongtin90@gmail.com;hominhtrang2021@gmail.com;trankhanglee001@gmail.com',
            // to: 'trantrungtruc220691@gmail.com',
            subject: subject,
            text: content
        };
    
        transporter.sendMail(mailOptions);
    } catch (e) {
        console.log(`Error send mail`);
        return { data: `error: ${e}`, status: "fail" };
    }
};