import nodemailer, { SendMailOptions } from "nodemailer";
import { getInstance } from "xpresser";
import aws, { SES } from "@aws-sdk/client-ses";
import { Address, AttachmentLike, Attachment } from "nodemailer/lib/mailer";
import { Readable } from "stream";

const $ = getInstance();

// Get config
const config = $.config.path("mailer");

let transporter: any;

if (config.get("provider") === "AWS") {
    process.env.AWS_ACCESS_KEY_ID = config.get("AWS_ACCESS_KEY_ID");
    process.env.AWS_SECRET_ACCESS_KEY = config.get("AWS_SECRET_ACCESS_KEY");

    // Set the AWS Region.
    const REGION = config.get("region"); //e.g. "us-east-1"
    // const sesClient = new SESClient({ region: REGION });
    const ses = new SES({
        apiVersion: "2010-12-01", // lock api version
        region: REGION
    });

    transporter = nodemailer.createTransport({
        SES: { ses, aws },
        sendingRate: config.get("sendingRate") || 1
    });
} else {
    transporter = nodemailer.createTransport({
        host: config.get("host"),
        port: config.get("port"),
        ...(config.get("port") === 465 ? { secure: true } : { secure: false }),
        auth: {
            user: config.get("username"),
            pass: config.get("password")
        }
    });
}

export const sendMail = async (
    $to: string | Address | Array<string | Address>,
    $subject: string,
    $message: string | Buffer | Readable | AttachmentLike,
    $messageType: string = "html",
    $attachments?: Attachment[]
): Promise<void> => {
    const from = config.get("from") || $.config.get("name");

    const mail: SendMailOptions = {
        from: `${from} <${config.get("fromEmail")}>`,
        to: $to,
        subject: $subject,
        ...($messageType === "html" ? { html: $message } : { text: $message }),
        ...($attachments && { attachments: $attachments })
    };

    await transporter.sendMail(mail);
};

export type AttachmentType = Attachment;
