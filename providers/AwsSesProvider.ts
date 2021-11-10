import { MailProvider } from "../MailProvider";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { sendMail } from "../index";

// -------- Creating a provider. ---------
const AwsSesProvider = new MailProvider<Transporter, SendMailOptions>("aws", {
    /**
     * Initialize
     * Validate Config and Return Client/Transporter
     * @param config
     * @param $
     */
    initialize(config, $) {
        // Remove null or undefined values.
        config.removeNullOrUndefined();

        // Check for required keys.
        for (const val of ["region", "fromEmail", "AWS_SECRET_ACCESS_KEY", "AWS_ACCESS_KEY_ID"]) {
            if (!config.get(val)) {
                throw new Error(`Mailer aws config: {${val}} is missing!`);
            }
        }

        // Require AWS-SES
        const aws = require("@aws-sdk/client-ses") as typeof import("@aws-sdk/client-ses");

        process.env.AWS_ACCESS_KEY_ID = config.get("AWS_ACCESS_KEY_ID");
        process.env.AWS_SECRET_ACCESS_KEY = config.get("AWS_SECRET_ACCESS_KEY");

        // Set the AWS Region.
        const REGION = config.get("region"); //e.g. "us-east-1"
        // const sesClient = new SESClient({ region: REGION });

        const ses = new aws.SES({
            apiVersion: "2010-12-01", // lock api version
            region: REGION
        });

        // Return client.
        return nodemailer.createTransport({
            SES: { ses, aws },
            sendingRate: config.get("sendingRate") || 1
        });
    },

    sendMail({ mail, client }) {
        return client.sendMail(mail);
    }
});

export default AwsSesProvider;

/**
 * Send mail via Aws-SES
 * Helper function with types.
 * @param message
 */
export function sendMailViaAwsSES(message: SendMailOptions) {
    return sendMail(message, AwsSesProvider.name);
}
