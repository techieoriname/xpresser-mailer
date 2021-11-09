import { DollarSign } from "xpresser/types";
import { isPackageExists } from "local-pkg";


export function run(plugin: any, $: DollarSign) {
    const packageName = plugin.namespace;

    // Check package config
    if (!$.config.has(packageName)) {
        return $.logErrorAndExit(`Config ${packageName}" is required!`);
    }

    // Validate package config.
    const config = $.config.path(packageName);

    // Get provider
    const provider = config.get("provider") as string | undefined;
    if (!provider) {
        return $.logErrorAndExit(`"provider" is required in config: "${packageName}"`);
    }

    // validate provider.
    if (!provider.match(/^(AWS|SMTP)$/)) {
        return $.logErrorAndExit(
            `"${config.get("provider")}" is not a valid provider {SMTP | AWS}`
        );
    }

    if (provider === "AWS") {
        if (!isPackageExists("@aws-sdk/client-ses")) {
            $.logWarning(`Package {@aws-sdk/client-ses} is required for AWS`);
            return $.logErrorAndExit("Install missing package and restart server!");
        }

        let requiredFields = [
            "region",
            "fromEmail",
            "AWS_SECRET_ACCESS_KEY",
            "AWS_ACCESS_KEY_ID"
        ];

        requiredFields.forEach((value) => {
            if (!config.get(value)) {
                return $.logErrorAndExit(`mailer {${value}} is missing!`);
            }
        });

    } else {

        let requiredFields = ["host", "port", "username", "password", "fromEmail"];

        requiredFields.forEach((value) => {
            if (!config.get(value)) {
                return $.logErrorAndExit(`mailer {${value}} is missing!`);
            }
        });
    }
}
