import { Controller, Http } from "xpresser/types/http";
import { AttachmentType, sendMail } from "../../index";
import * as path from "path";

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
            const attachments: AttachmentType[] = [
                {
                    // filename (optional)
                    filename: "techieoriname.png",
                    // file path or url
                    path: path.join(__dirname, "..", "TechieOriname.png")
                }
            ];

            await sendMail(
                "example@example.com",
                "testing subject",
                "my message here",
                "text",
                attachments
            );

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
