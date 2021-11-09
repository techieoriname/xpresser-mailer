import { DollarSign, PluginData } from "xpresser/types";
import { MailProvider } from "./MailProvider";

export async function run(plugin: PluginData, $: DollarSign) {
    // Do nothing if native command e.g 'make:controller'
    if ($.isNativeCliCommand()) return;

    // Get package name.
    const packageName = plugin.namespace;

    /**
     * Create a memory space in xpresser's EngineData.
     * For storing plugin's re-usable related data
     */
    const pluginMemory = $.engineData.path(packageName).defaults({
        // Holds resolved provider class instances.
        resolvedProviders: {},
        // Holds initialized providers data.
        initializedProviders: {}
    });

    // Get resolvedProviders as a Collection
    const resolvedProviders = pluginMemory.path("resolvedProviders");

    // Check plugin config exists
    if (!$.config.has(packageName)) {
        return $.logErrorAndExit(`Config ${packageName}" is required!`);
    }

    // Get plugin config
    const config = $.config.path(packageName);

    /**
     * Out of the box providers.
     */
    const Providers = {
        smtp: plugin.path + "/providers/SmtpProvider"
    };

    /**
     * if config has customProviders object with values.
     *  merge them to the list of providers above.
     */
    const CustomProviders = config.path("customProviders").removeNullOrUndefined();
    if (CustomProviders.length()) {
        Object.assign(Providers, CustomProviders.data);
    }

    /**
     * Load Provider files
     */
    for (const [provider, providerPath] of Object.entries(Providers)) {
        try {
            const p = require($.path.resolve(providerPath));

            // Store resolved provider.
            resolvedProviders.set(provider, p);
        } catch (e: any) {
            $.logError(`Error loading ${packageName} Provider: ${providerPath}`);
            $.logErrorAndExit(e);
        }
    }

    // Get provider
    const provider = config.get("provider") as string | undefined;
    if (!provider) {
        return $.logErrorAndExit(`"provider" is required in config: "${packageName}"`);
    }

    // Check if provider exists in resolved providers
    if (!resolvedProviders.has(provider)) {
        return $.logErrorAndExit(
            [
                `"${provider}" is not a registered provider.`,
                `Registered Providers: [${resolvedProviders.keys().join(", ")}]`
            ].join("\n")
        );
    }

    /**
     * Validate default provider config
     */
    const defProvider: MailProvider = resolvedProviders.get(provider);

    try {
        await defProvider.initialize();
    } catch (e: any) {
        return $.logErrorAndExit(e.message);
    }
}
