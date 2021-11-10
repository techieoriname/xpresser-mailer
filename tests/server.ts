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
                port: env["SMTP_PORT"],
                username: env["SMTP_USERNAME"],
                password: env["SMTP_PASSWORD"],
                fromEmail: env["SMTP_FROM_EMAIL"]
            }
        }
    }
}).initializeTypescript(__filename);

/**
 * Add Route.
 */
$.on.boot((next) => {
    $.logInfo(`Visit server url to view test result:`);

    // Set index route
    $.router.get("/", "Tests@index");

    return next();
});

/**
 * Boot.
 */
$.boot();
