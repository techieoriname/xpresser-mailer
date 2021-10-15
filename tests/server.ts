import { init } from "xpresser";

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
        provider: "SMTP",
        host: "smtp.host.com",
        port: 2525,
        username: "username",
        password: "password",
        fromEmail: "no-reply@example.com"
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
