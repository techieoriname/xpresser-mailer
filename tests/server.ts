import { init } from "xpresser";
import envLoader from "@xpresser/env";
const env = envLoader(__dirname + "/.env", {
    required: ["MAIL_PROVIDER"]
});

/**
 * Initialize Xpresser.
 */
const $ = init({
    name: "Xpresser Mailer",
    env: "development",

    // Set Paths
    paths: {
        base: __dirname,
        // Set backend folder as base.
        backend: __dirname
    },

    // Plugin Config
    mailer: {
        provider: env["MAIL_PROVIDER"],
        configs: {
            smtp: {
                host: env["SMTP_HOST"],
                port: Number(env["SMTP_PORT"]),
                auth: { user: env["SMTP_USERNAME"], pass: env["SMTP_PASSWORD"] },
                fromEmail: env["SMTP_FROM_EMAIL"]
            },

            postmark: {
                apiToken: env["POSTMARK_API_TOKEN"]
            }
        }
    }
}).initializeTypescript(__filename);

/**
 * Add Route.
 */
$.on.boot((next) => {
    // Set index route
    $.router.get("/", "Tests@index");
    $.router.get("/smtp", "Tests@smtp").actionAsName();
    $.router.get("/aws", "Tests@aws").actionAsName();
    $.router.get("/postmark", "Tests@postmark").actionAsName();

    return next();
});

/**
 * Add test log.
 */
$.on.serverBooted((next) => {
    $.logInfo(`Visit server url to view test result.`);
    return next();
});

/**
 * Boot.
 */
$.boot();
