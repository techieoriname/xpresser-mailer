import { MailProvider } from "../MailProvider";
import { Message, ServerClient } from "postmark";

export default new MailProvider<ServerClient, Message>("postmark", {
    initialize(config) {
        config.removeNullOrUndefined();

        // validate Config
        if (!config.get("apiToken")) throw new Error("Postmark config {apiToken} is required");

        // Require Postmark
        const postmark = require("postmark") as typeof import("postmark");

        // Initialize and return client
        return new postmark.Client(config.get("apiToken"));
    },
    sendMail({ mail, client }) {
        return client.sendEmail(mail);
    }
});
