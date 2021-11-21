import { MailProvider } from "../MailProvider";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { sendMail } from "../index";
import { Abolish } from "abolish";

// -------- Creating a provider. ---------
const SmtpProvider = new MailProvider<Transporter, SendMailOptions>("smtp", {
    initialize(config) {
        /**
         * Validate Config Object
         */
        const [err] = Abolish.validate(config.data, {
            // all is required and must be typeof string
            "*": "required|typeof:string",
            host: { $name: "{host}" },
            port: { $name: "{port}", typeof: false },
            "auth.user": { $name: "{auth.user}" },
            "auth.pass": { $name: "{auth.pass}" }
        });

        if (err) throw new Error(`Smtp Config: ${err.message}`);

        // Return client.
        return nodemailer.createTransport(config.data);
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
