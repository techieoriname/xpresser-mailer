import type {Controller, Http} from "xpresser/types/http";
import {sendMail} from "../../index";
import path from "path";
import type {SendMailOptions} from "nodemailer";
import type {Attachment} from "nodemailer/lib/mailer";
import type {Message} from "postmark";

const attachments: Attachment[] = [
    {
        // filename (optional)
        filename: "techieoriname.png",
        // file path or url
        path: path.join(__dirname, "..", "TechieOriname.png")
    }
];

/**
 * AppController
 */
export = <Controller.Object>{
    // Controller Name
    name: "AppController",

    // Controller Default Error Handler.
    e: (http: Http, error: string) => http.status(401).json({error}),

    index(http) {
        const $ = http.$instance();

        return {
            smtp: $.helpers.route("smtp"),
            aws: $.helpers.route("aws"),
            postmark: $.helpers.route("postmark")
        };
    },

    /**
     * Test SMTP
     * To show functions are used.
     * @param http - Current Http Instance
     */
    async smtp(http) {
        try {
            const mail = await sendMail<SendMailOptions>({
                from: "you@example.com",
                to: "me@example.com",
                subject: "testing subject",
                html: "my message here",
                attachments
            });

            return http.send({
                mail,
                msg: "Email sent successfully"
            });
        } catch (e: any) {
            return http.status(500).send({
                msg: "An error occurred",
                error: e
            });
        }
    },

    /**
     * Test Postmark
     * @param http - Current Http Instance
     */
    async postmark(http) {
        try {
            const mail = await sendMail<Message>({
                From: "you@example.com",
                To: "me@example.com",
                Subject: "testing subject",
                HtmlBody: "my message here"
            });

            return http.send({
                mail,
                msg: "Email sent successfully"
            });
        } catch (e: any) {
            return http.status(500).send({
                msg: "An error occurred",
                error: e
            });
        }
    },

    /**
     * Test AWS
     * @param http - Current Http Instance
     */
    async aws(http) {
        try {
            const mail = await sendMail<SendMailOptions>({
                from: "you@example.com",
                to: "me@example.com",
                subject: "testing subject",
                html: "my message here",
                attachments
            });

            return http.send({
                mail,
                msg: "Email sent successfully"
            });
        } catch (e: any) {
            return http.status(500).send({
                msg: "An error occurred",
                error: e
            });
        }
    }
};
