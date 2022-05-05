import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export let send = async (subject, content) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crawlgame91@gmail.com',
                pass: 'Trungtruc'
            }
        });
    
        var mailOptions = {
            from: 'crawlgame91@gmail.com',
            to: 'hotrongtin90@gmail.com;hominhtrang2021@gmail.com',
            subject: subject,
            text: content
        };
    
        transporter.sendMail(mailOptions);
    } catch (e) {
        console.log(`Error send mail`);
        return { data: `error: ${e}`, status: "fail" };
    }
};