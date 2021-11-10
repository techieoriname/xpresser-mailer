import { MailProvider } from "../MailProvider";
import { Message, ServerClient } from "postmark";
import { sendMail } from "../index";

const PostmarkProvider = new MailProvider<ServerClient, Message>("postmark", {
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

export default PostmarkProvider;

/**
 * Send mail via Postmark
 * Helper function with types.
 * @param message
 */
export function sendMailViaPostmark(message: Message) {
    return sendMail(message, PostmarkProvider.name);
}
