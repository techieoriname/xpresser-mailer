import { MailProvider } from "../MailProvider";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { sendMail } from "../index";

// -------- Creating a provider. ---------
const SmtpProvider = new MailProvider<Transporter, SendMailOptions>("smtp", {
    initialize(config) {
        // Remove null or undefined values.
        config.removeNullOrUndefined();

        // Check for required keys.
        for (const val of ["host", "port", "username", "password", "fromEmail"]) {
            if (!config.get(val)) {
                throw new Error(`Mailer smtp config: {${val}} is missing!`);
            }
        }

        // Return client.
        return nodemailer.createTransport({
            host: config.get("host"),
            port: config.get("port"),
            ...(config.get("port") === 465 ? { secure: true } : { secure: false }),
            auth: {
                user: config.get("username"),
                pass: config.get("password")
            }
        });
    },

    sendMail({ mail, client, config }) {
        if (!mail.from) mail.from = config.get("fromEmail");

        return client.sendMail(mail);
    }
});

export default SmtpProvider;

/**
 * Send mail via smtp
 * Helper function with types.
 * @param message
 */
export function sendMailViaSmtp(message: SendMailOptions) {
    return sendMail(message, SmtpProvider.name);
}
