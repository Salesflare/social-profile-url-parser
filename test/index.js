'use strict';

const Lab = require('lab');
const Code = require('code');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

const SocialProfileUrlParser = require('..');

describe('url parser', () => {

    it('finds social profiles', () => {

        const testText = `
            SlackHQ	klout	http://klout.com/SlackHQ
            SlackLoveTweets	klout	http://klout.com/SlackLoveTweets
            slack	crunchbasecompany	http://www.crunchbase.com/organization/slack
            tiny-speck	crunchbasecompany	http://www.crunchbase.com/organization/tiny-speck
            slack	angellist	https://angel.co/slack
            SlackHQ	twitter	https://twitter.com/SlackHQ
            SlackLoveTweets	twitter	https://twitter.com/SlackLoveTweets
            slackhq	facebook	https://www.facebook.com/slackhq
            tiny-speck-inc	linkedincompany	https://www.linkedin.com/company/tiny-speck-inc
            UCY3YECgeBcLCzIrFLP4gblw	youtube	https://youtube.com/channel/UCY3YECgeBcLCzIrFLP4gblw
            slack	angellist	https://angel.co/slack
       `;

        const result = SocialProfileUrlParser.parse(testText);
        expect(result).to.equal([
            {
                type: 'angellist',
                username: 'slack',
                url: 'https://angel.co/slack'
            },
            {
                type: 'facebook',
                username: 'slackhq',
                url: 'https://www.facebook.com/slackhq'
            },
            {
                type: 'klout',
                username: 'SlackHQ',
                url: 'http://klout.com/SlackHQ'
            },
            {
                type: 'klout',
                url: 'http://klout.com/SlackLoveTweets',
                username: 'SlackLoveTweets'
            },
            {
                type: 'twitter',
                username: 'SlackHQ',
                url: 'https://twitter.com/SlackHQ'
            },
            {
                type: 'twitter',
                url: 'https://twitter.com/SlackLoveTweets',
                username: 'SlackLoveTweets'
            },
            {
                type: 'youtube',
                url: 'https://youtube.com/channel/UCY3YECgeBcLCzIrFLP4gblw',
                username: 'UCY3YECgeBcLCzIrFLP4gblw'
            }
        ]);
    });
});
