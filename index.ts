import { getInstance } from "xpresser";
import type { MailProvider } from "./MailProvider";

const $ = getInstance();

// Get config
const config = $.config.path("mailer");
// Default Provider
const defaultProvider = config.get("provider") as string;
// Get Resolved Providers
const resolvedProviders = $.engineData.sync("mailer.resolvedProviders");

export async function sendMail<Mail = any, MailResponse = any>(
    mail: Mail,
    provider?: string
): Promise<MailResponse> {
    if (!provider) provider = defaultProvider;

    /**
     * Validate default provider config
     */
    const Provider: MailProvider = resolvedProviders.sync[provider];

    // throw Error if provider does not exists.
    if (!Provider) throw new Error(`Provider: {${provider}} used in (sendMail) does not exists.`);

    // Initialize if not initialized
    if (!Provider.initialized) {
        await Provider.initialize();
    }

    // Return mailer
    return Provider.sendMail(mail);
}
