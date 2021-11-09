import { init } from "xpresser";

const env = {} as Record<string, any>;
/**
 * Initialize Xpresser.
 */
const $ = init({
    name: "Test Mailer Plugin",
    env: "development",

    // Set Paths
    paths: {
        base: __dirname,
        // Set backend folder as base.
        backend: __dirname
    },

    // Plugin Config
    mailer: {
        provider: "smtp",
        configs: {
            smtp: {
                hello: null,
                host: "smtp.host.com",
                port: 2525,
                username: "username",
                password: "password",
                fromEmail: "no-reply@example.com"
            },

            mailgun: {
                domain: env["MAILGUN_DOMAIN"],
                secret: env["MAILGUN_SECRET"],
                endpoint: "api.eu.mailgun.net"
            }
        }
        // customProviders: {a: 1, b: 2}
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
