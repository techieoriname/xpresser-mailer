import { DollarSign } from "xpresser/types";

const packageName = "mailer";

export function run(plugin: any, $: DollarSign) {
    $.ifNotConsole(() => {
        if (!$.config.has(packageName)) {
            return $.logErrorAndExit(`Config "maiiler" is required!`);
        }
        const config = $.config.path(packageName);

        if (!config.has("provider")) {
            return $.logErrorAndExit(`"provider" is required in config: "${packageName}"`);
        }

        if (!config.get("provider").match(/^(AWS|SMTP)$/)) {
            return $.logErrorAndExit(
                `"${config.get("provider")}" is not a valid provider {SMTP | AWS}`
            );
        }

        if (config.get("provider") === "AWS") {
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
    });
}
