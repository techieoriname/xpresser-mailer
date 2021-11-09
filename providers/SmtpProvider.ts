import { MailProvider } from "../MailProvider";
import nodemailer, { SendMailOptions, Transporter } from "nodemailer";

// -------- Creating a provider. ---------
const SmtpProvider = new MailProvider<Transporter, SendMailOptions>("smtp", {
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
        for (const val of ["host", "port", "username", "password", "fromEmail"]) {
            if (!config.has(val)) {
                throw new Error(`Mailer smtp config: {${val}} is missing!`);
            }
        }

        if (!config.has("from")) config.set("from", $.config.get("name"));

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

    sendMail({ mail, client }) {
        console.log(mail);

        return client.sendMail(mail);
    }
});

export = SmtpProvider;
