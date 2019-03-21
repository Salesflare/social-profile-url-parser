'use strict';

const Lab = require('lab');
const Code = require('code');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

const SocialProfileUrlParser = require('..');

describe('url parser', () => {

    it('finds social profiles', () => {

        // Prefix lines needed to matched with ± so we can test the amount of results expected
        const testText = `
            ±    SlackHQ	klout	http://klout.com/SlackHQ
            ±    SlackLoveTweets	klout	http://klout.com/SlackLoveTweets

            ±    slack	crunchbasecompany	http://www.crunchbase.com/organization/slack
            ±    tiny-speck	crunchbasecompany	http://www.crunchbase.com/company/tiny-speck
            ±    tiny-speck	crunchbasecompany	http://www.crunchbase.com/person/slackcrunchperson

            ±    slack	angellist	https://angel.co/slack

            ±    SlackHQ	twitter	https://twitter.com/SlackHQ
            ±    SlackLoveTweets	twitter	https://twitter.com/SlackLoveTweets
            ±    SlackLoveTweets	twitter	https://mobile.twitter.com/mobiletwitter

            ±    slackhq	facebook	https://www.facebook.com/slackhq
            ±    https://nl-nl.facebook.com/slacklocalized

            ±    tiny-speck-inc	linkedincompany	https://www.linkedin.com/in/defaultlinkedin
            ±    tiny-speck-inc	linkedincompany	https://www.linkedin.com/company/tiny-speck-inc
            ±    tiny-speck-inc	linkedincompany	https://www.linkedin.com/school/linkedinschool
            ±    tiny-speck-inc	linkedincompany	https://www.linkedin.com/edu/linkedinedu
            ±    tiny-speck-inc	linkedincompany	https://www.linkedin.com/sales/people/salespeoplelinkedin
            ±    tiny-speck-inc	linkedincompany	https://www.linkedin.com/profile/view?id=AAkAAAAUPBYBUvwhRxT8bCEs3ZtRallalala -> should match
                 tiny-speck-inc	linkedincompany	https://www.linkedin.com/profile/view?id=12345 -> shouldn't match

            ±    UCY3YECgeBcLCzIrFLP4gblw	youtube	https://youtube.com/channel/UCY3YECgeBcLCzIrFLP4gblw
            ±    UCY3YECgeBcLCzIrFLP4gblw	youtube	https://youtube.com/c/UCY3YECgeBcLCzIrFLP4gblc
            ±    UCY3YECgeBcLCzIrFLP4gblw	youtube	https://youtube.com/user/UCY3YECgeBcLCzIrFLP4user
            ±    https://youtube.com/justchannelname

            ±    https://local.yahoo.com/josl
            ±    https://profile.yahoo.com/josp
            ±    https://me.yahoo.com/josm

            ±    https://medium.com/@salesflare-at
            ±    https://medium.com/salesflare
       `;
        const AMOUNT_OF_PROFILES = testText.match(/±/g).length;

        const result = SocialProfileUrlParser.parse(testText);
        expect(result).to.equal([
            {
                type: 'angellist',
                username: 'slack',
                url: 'https://angel.co/slack'
            },
            {
                type: 'crunchbase',
                url: 'http://www.crunchbase.com/organization/slack',
                username: 'slack'
            },
            {
                type: 'crunchbase',
                url: 'http://www.crunchbase.com/company/tiny-speck',
                username: 'tiny-speck'
            },
            {
                type: 'crunchbase',
                url: 'http://www.crunchbase.com/person/slackcrunchperson',
                username: 'slackcrunchperson'
            },
            {
                type: 'facebook',
                username: 'slackhq',
                url: 'https://www.facebook.com/slackhq'
            },
            {
                type: 'facebook',
                url: 'https://nl-nl.facebook.com/slacklocalized',
                username: 'slacklocalized'
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
                type: 'linkedin',
                url: 'https://www.linkedin.com/in/defaultlinkedin',
                username: 'defaultlinkedin'
            },
            {
                type: 'linkedin',
                url: 'https://www.linkedin.com/company/tiny-speck-inc',
                username: 'tiny-speck-inc'
            },
            {
                type: 'linkedin',
                url: 'https://www.linkedin.com/school/linkedinschool',
                username: 'linkedinschool'
            },
            {
                type: 'linkedin',
                url: 'https://www.linkedin.com/edu/linkedinedu',
                username: 'linkedinedu'
            },
            {
                type: 'linkedin',
                url: 'https://www.linkedin.com/sales/people/salespeoplelinkedin',
                username: 'salespeoplelinkedin'
            },
            {
                'type': 'linkedin',
                'url': 'https://www.linkedin.com/profile/view?id=AAkAAAAUPBYBUvwhRxT8bCEs3ZtRallalala',
                'username': 'AkAAAAUPBYBUvwhRxT8bCEs3ZtRallalala'
            },
            {
                type: 'medium',
                url: 'https://medium.com/@salesflare-at',
                username: 'salesflare-at'
            },
            {
                type: 'medium',
                url: 'https://medium.com/salesflare',
                username: 'salesflare'
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
                type: 'twitter',
                url: 'https://mobile.twitter.com/mobiletwitter',
                username: 'mobiletwitter'
            },
            {
                type: 'yahoo',
                url: 'https://local.yahoo.com/josl',
                username: 'josl'
            },
            {
                type: 'yahoo',
                url: 'https://profile.yahoo.com/josp',
                username: 'josp'
            },
            {
                type: 'yahoo',
                url: 'https://me.yahoo.com/josm',
                username: 'josm'
            },
            {
                type: 'youtube',
                url: 'https://youtube.com/channel/UCY3YECgeBcLCzIrFLP4gblw',
                username: 'UCY3YECgeBcLCzIrFLP4gblw'
            },
            {
                'type': 'youtube',
                'url': 'https://youtube.com/c/UCY3YECgeBcLCzIrFLP4gblc',
                'username': 'UCY3YECgeBcLCzIrFLP4gblc'
            },
            {
                'type': 'youtube',
                'url': 'https://youtube.com/user/UCY3YECgeBcLCzIrFLP4user',
                'username': 'UCY3YECgeBcLCzIrFLP4user'
            },
            {
                type: 'youtube',
                url: 'https://youtube.com/justchannelname',
                username: 'justchannelname'
            }
        ]);
        expect(result.length).to.equal(AMOUNT_OF_PROFILES);
    });
});
