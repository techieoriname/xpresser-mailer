import { getInstance } from "xpresser";
import ObjectCollection from "object-collection";
import { DollarSign } from "xpresser/types";

// export type MailMessage = { from: string; to: string; subject: string; body: string };

type SendMailFn<Client, Mail> = (
    data: {
        mail: Mail;
        config: ObjectCollection;
        client: Client;
    },
    $: DollarSign
) => any;

export type MailProviderSetupConfig<Client, Mail> = {
    initialize: (config: ObjectCollection, $: DollarSign) => void | any;
    sendMail: SendMailFn<Client, Mail>;
};

const $ = getInstance();

/**
 * This class provides a structure for other providers to follow and extend
 */
class MailProvider<Client = any, Mail = any> {
    name: string;
    setup: MailProviderSetupConfig<Client, Mail>;
    initialized: boolean = false;
    config: ObjectCollection;

    constructor(name: string, setup: MailProviderSetupConfig<Client, Mail>) {
        this.name = name;
        this.setup = setup;
        this.config = $.config.path(`mailer.configs.${name}`);
    }

    async sendMail(mail: Mail) {
        if (!this.setup.sendMail) throw `${this.name} provider does not have "sendMail" function`;

        // Get mail config
        const providerConfig = $.config.path(`mailer.configs.${this.name}`);

        if (!(mail as any).from)
            (mail as any).from = providerConfig.get("from") || $.config.get("name");

        // Run custom function defined..
        return this.setup.sendMail(
            {
                mail,
                config: providerConfig,
                client: this.getInitializedClient()
            },
            $
        );
    }

    async initialize(): Promise<Client> {
        // if initialized return initialized client from memory
        if (this.initialized) return this.getInitializedClient();

        // Check if setup has initialize fn
        if (!this.setup.initialize)
            throw `${this.name} provider does not have "initialize" function`;

        // Run custom function defined..
        const client = await this.setup.initialize(this.config, $);

        // Store initialized provider result to memory
        if (client) $.engineData.path("mailer.initializedProviders").set(this.name, client);

        // Set as initialized
        this.initialized = true;

        return client as Client;
    }

    getInitializedClient(): Client {
        // Get initialized provider from memory.
        return $.engineData.path("mailer.initializedProviders").get(this.name);
    }
}

export { MailProvider };
