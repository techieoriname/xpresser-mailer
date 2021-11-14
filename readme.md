# XpresserJs Mailer Plugin

[![Build Status](https://circleci.com/gh/wildbit/postmark.js.svg?style=shield)](https://circleci.com/gh/wildbit/postmark.js)
[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/@techie04%2Fxpresser-mailer.svg)](https://badge.fury.io/js/@techie04%2Fxpresser-mailer)

A library to help you send mails.

This plugin makes use of [nodemailer](https://www.npmjs.com/package/nodemailer)
and [aws-sdk ses](https://www.npmjs.com/package/@aws-sdk/client-ses).

**MENU**

- [Installation](#installation)
- [Add to plugins.json](#add-to-pluginsjson)
- [Add Config](#add-to-your-project-config)
- [Usage](#usage)

### Installation

```sh
npm i @techie04/xpresser-mailer

# OR
yarn add @techie04/xpresser-mailer

```

### Add to plugins.json

```json
{
  "npm://@techie04/xpresser-mailer": true
}
```

### Add to your project config.

```javascript
({
    // SMTP CONFIG
    "mailer": {
        provider: "SMTP", // SMTP
        configs: {
            smtp: {
                host: "", // SMTP Server Host
                port: "", // SMTP Server Port
                username: "", // SMTP Server Username
                password: "", // SMTP Server Password
                fromEmail: "no-reply@example.com" // From email
            },
            
            aws: {
                region: "", // AWS Server Region
                fromEmail: "no-reply@example.com", // From email
                // AWS credentials
                AWS_ACCESS_KEY_ID: "",
                AWS_SECRET_ACCESS_KEY: ""
            },
            
            postmark: {
                apiToken: ""
            }
        }
    },

})
```

### Usage

In your controller or anywhere in your project.

###### Javascript

```javascript
const { sendMail } = require("@techie04/xpresser-mailer");

await sendMail(message);
```

###### Typescript

```typescript
import { sendMail } from "@techie04/xpresser-mailer";

await sendMail<Message, MessageResponse>(message);
```

- **Message:** Type of message content (depending on provider)
- **MessageResponse:** Type of response returned to the `sendMail` function (depending on provider)

### Creating a custom provider

Create a file, maybe `providers/CustomProvider.ts`

```typescript
import { MailProvider } from "@techie04/xpresser-mailer/MailProvider";

// The name should be the same with the config key.
const CustomProvider = new MailProvider("customProvider", {
    /**
     * Initialize your provider.
     * @param config - The config for your provider. i.e mailer.configs.customProvider
     * @param $ - xpresser instance
     */
    initialize(config, $) {
        // Validate config here
        // return client.
    },

    /**
     * Send mail function.
     * @param mail - the mail object or data
     * @param config - The config for your provider. i.e mailer.configs.customProvider
     * @param client - The client returned from the initialize function above.
     * @param $
     */
    sendMail({ mail, config, client }, $) {
        // Send mail here.
    }
});

export default CustomProvider;
```

###### Add to config
```javascript
const config = {
    "mailer": {
        // ... other configs
        customProviders: {
            // key is providers name
            // value is path to provider file without .js or .ts
            customProvider: "providers/CustomProvider"
        }
    }
}
```