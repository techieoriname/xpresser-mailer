import { Controller, Http } from "xpresser/types/http";
import { sendMail } from "../../index";
import * as path from "path";
import { SendMailOptions } from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";

/**
 * AppController
 */
export = <Controller.Object>{
    // Controller Name
    name: "AppController",

    // Controller Default Error Handler.
    e: (http: Http, error: string) => http.status(401).json({ error }),

    /**
     * Example Action.
     * To show functions are used.
     * @param http - Current Http Instance
     */
    async index(http: Http): Promise<Http.Response> {
        try {
            const attachments: Attachment[] = [
                {
                    // filename (optional)
                    filename: "techieoriname.png",
                    // file path or url
                    path: path.join(__dirname, "..", "TechieOriname.png")
                }
            ];

            await sendMail<SendMailOptions>({
                from: "you@example.com",
                to: "me@example.com",
                subject: "testing subject",
                html: "my message here",
                attachments
            });

            return http.send({
                msg: "Email sent successfully"
            });
        } catch (e) {
            return http.status(500).send({
                msg: "An error occurred",
                e
            });
        }
    }
};
