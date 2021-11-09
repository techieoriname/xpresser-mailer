import { getInstance } from "xpresser";
import { MailProvider } from "./MailProvider";

const $ = getInstance();

// Get config
const config = $.config.path("mailer");
// Default Provider
const defaultProvider = config.get("provider") as string;
// Get Resolved Providers
const resolvedProviders = $.engineData.sync("mailer.resolvedProviders");

export async function sendMail<Mail extends Record<string, any>>(mail: Mail, provider?: string) {
    if (!provider) provider = defaultProvider;

    /**
     * Validate default provider config
     */
    const Provider: MailProvider = resolvedProviders.sync[provider];

    if (!Provider) throw new Error(`Provider: {${provider}} used in (sendMail) does not exists.`);

    if (!Provider.initialized) {
        try {
            await Provider.initialize();
        } catch (e: any) {
            return $.logErrorAndExit(e.message);
        }
    }

    return Provider.sendMail(mail);
}
