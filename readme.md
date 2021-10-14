# XpresserJs Mailer Plugin

A library to help you send mails.

This plugin makes use of [nodemailer](https://www.npmjs.com/package/nodemailer) and [aws-sdk ses](https://www.npmjs.com/package/@aws-sdk/client-ses).

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
        host: "", // SMTP Server Host
        port: "", // SMTP Server Port
        username: "", // SMTP Server Username
        password: "", // SMTP Server Password
        fromEmail: "no-reply@example.com" // From email
    },

    // AWS CONFIG
    "mailer": {
        provider: "AWS", // AWS
        region: "", // AWS Server Region
        fromEmail: "no-reply@example.com", // From email
        // AWS credentials
        AWS_ACCESS_KEY_ID: "",
        AWS_SECRET_ACCESS_KEY: ""
    },
  
})
```


### Usage

In your controller or anywhere in your project.

```javascript
const { sendMail } = require("@techie04/xpresser-mailer");

(async () => {
    await sendMail(
        "example@example.com", // to email
        "testing subject", // message subject
        "my message here", // message body
        "text" // message format ("html" or "text")
    );
});

```

### Typescript support
```typescript
import { sendMail } from "@techie04/xpresser-mailer";

await sendMail(
    "techieoriname@gmail.com",
    "testing subject",
    "my message here",
    "text"
);
```
