# social-profile-url-parser

Node library to parse social profile urls out of text.

```js
const SocialProfileUrlParser = require('@salesflare/social-profile-url-parser');

const result = SocialProfileUrlParser.parse(`
    slack   angellist   https://angel.co/slack
    SlackHQ twitter     https://twitter.com/SlackHQ
`)
result === [
    {
        type: 'angellist',
        username: 'slack',
        url: 'https://angel.co/slack'
    },
    {
        type: 'twitter',
        username: 'SlackHQ',
        url: 'https://twitter.com/SlackHQ'
    }
];
```
