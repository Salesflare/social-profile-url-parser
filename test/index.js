'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

const SocialProfileUrlParser = require('..');

describe('url parser', () => {

    it('finds social profiles', () => {
        // Prefix lines needed to matched with ± so we can test the amount of results expected
        const testText = `
                 SlackHQ	klout	http://klout.com/SlackHQ
                 SlackLoveTweets	klout	http://klout.com/SlackLoveTweets

            ±    slack	crunchbasecompany	http://www.crunchbase.com/organization/slack
            ±    tiny-speck	crunchbasecompany	http://www.crunchbase.com/company/tiny-speck
            ±    tiny-speck	crunchbasecompany	http://www.crunchbase.com/person/slackcrunchperson

            ±    slack	angellist	https://angel.co/slack

            ±    https://ok.ru/profile/55212321312

            ±    https://vk.com/csdwer96123

            ±    SlackHQ	twitter	https://twitter.com/SlackHQ
            ±    SlackLoveTweets	twitter	https://twitter.com/SlackLoveTweets
            ±    SlackLoveTweets	twitter	https://mobile.twitter.com/mobiletwitter

            ±    slackhq	facebook	https://www.facebook.com/slackhq
            ±    slackhq2	facebook	https://www.facebook.com/slackhq2"
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

            ±    https://www.yelp.com/biz/1-2-3-and-me-child-development-center-2-jacksonville
            ±    https://fr.yelp.be/biz/wooly-waterloo
            

            ±    https://medium.com/@salesflare-at
            ±    https://medium.com/salesflare

            ±    https://digg.com/users/salesflare

            ±    https://www.facebook.com/groups/slackgroup

            ±    https://www.flickr.com/people/flickrpeople
            ±    https://www.flickr.com/photos/flickrphotos
            ±    https://www.flickr.com/groups/flickrgroup

            ±    https://salesflare.tumblr.com
            ±    https://salesflare.wordpress.com

            ±    https://x.com/xdotcom
            ±    https://www.x.com/wwwxdotcom
            ±    https://mobile.x.com/mobilexdotcom
       `;
        const AMOUNT_OF_PROFILES = testText.match(/±/g).length;

        const result = SocialProfileUrlParser.parse(testText);

        // `username` is a deprecated alias of `id`, asserted separately so the fixtures stay readable
        expect(result.map(({ username, ...profile }) => profile)).to.equal([ //eslint-disable-line no-unused-vars
            {
                canonical_url: 'https://angel.co/slack',
                type: 'angellist',
                type_name: 'AngelList',
                url: 'https://angel.co/slack',
                id: 'slack'
            },
            {
                canonical_url: 'https://crunchbase.com/organization/slack',
                kind: 'company',
                type: 'crunchbase',
                type_name: 'CrunchBase',
                url: 'http://www.crunchbase.com/organization/slack',
                id: 'slack'
            },
            {
                canonical_url: 'https://crunchbase.com/organization/tiny-speck',
                kind: 'company',
                type: 'crunchbase',
                type_name: 'CrunchBase',
                url: 'http://www.crunchbase.com/company/tiny-speck',
                id: 'tiny-speck'
            },
            {
                canonical_url: 'https://crunchbase.com/person/slackcrunchperson',
                kind: 'person',
                type: 'crunchbase',
                type_name: 'CrunchBase',
                url: 'http://www.crunchbase.com/person/slackcrunchperson',
                id: 'slackcrunchperson'
            },
            {
                canonical_url: 'https://digg.com/users/salesflare',
                type: 'digg',
                type_name: 'Digg',
                url: 'https://digg.com/users/salesflare',
                id: 'salesflare'
            },
            {
                canonical_url: 'https://facebook.com/slackhq',
                type: 'facebook',
                type_name: 'Facebook',
                url: 'https://www.facebook.com/slackhq',
                id: 'slackhq'
            },
            {
                canonical_url: 'https://facebook.com/slackhq2',
                type: 'facebook',
                type_name: 'Facebook',
                url: 'https://www.facebook.com/slackhq2',
                id: 'slackhq2'
            },
            {
                canonical_url: 'https://facebook.com/slacklocalized',
                type: 'facebook',
                type_name: 'Facebook',
                url: 'https://nl-nl.facebook.com/slacklocalized',
                id: 'slacklocalized'
            },
            {
                canonical_url: 'https://facebook.com/groups/slackgroup',
                kind: 'group',
                type: 'facebook',
                type_name: 'Facebook',
                url: 'https://www.facebook.com/groups/slackgroup',
                id: 'slackgroup'
            },
            {
                canonical_url: 'https://flickr.com/people/flickrpeople',
                kind: 'person',
                type: 'flickr',
                type_name: 'Flickr',
                url: 'https://www.flickr.com/people/flickrpeople',
                id: 'flickrpeople'
            },
            {
                canonical_url: 'https://flickr.com/people/flickrphotos',
                kind: 'person',
                type: 'flickr',
                type_name: 'Flickr',
                url: 'https://www.flickr.com/photos/flickrphotos',
                id: 'flickrphotos'
            },
            {
                canonical_url: 'https://flickr.com/groups/flickrgroup',
                kind: 'group',
                type: 'flickr',
                type_name: 'Flickr',
                url: 'https://www.flickr.com/groups/flickrgroup',
                id: 'flickrgroup'
            },
            {
                canonical_url: 'https://linkedin.com/in/defaultlinkedin',
                kind: 'person',
                type: 'linkedin',
                type_name: 'LinkedIn',
                url: 'https://www.linkedin.com/in/defaultlinkedin',
                id: 'defaultlinkedin'
            },
            {
                canonical_url: 'https://linkedin.com/company/tiny-speck-inc',
                kind: 'company',
                type: 'linkedin',
                type_name: 'LinkedIn',
                url: 'https://www.linkedin.com/company/tiny-speck-inc',
                id: 'tiny-speck-inc'
            },
            {
                canonical_url: 'https://linkedin.com/school/linkedinschool',
                kind: 'school',
                type: 'linkedin',
                type_name: 'LinkedIn',
                url: 'https://www.linkedin.com/school/linkedinschool',
                id: 'linkedinschool'
            },
            {
                canonical_url: 'https://linkedin.com/school/linkedinedu',
                kind: 'school',
                type: 'linkedin',
                type_name: 'LinkedIn',
                url: 'https://www.linkedin.com/edu/linkedinedu',
                id: 'linkedinedu'
            },
            {
                kind: 'person',
                type: 'linkedin',
                type_name: 'LinkedIn',
                url: 'https://www.linkedin.com/sales/people/salespeoplelinkedin',
                id: 'salespeoplelinkedin'
            },
            {
                kind: 'person',
                type: 'linkedin',
                type_name: 'LinkedIn',
                url: 'https://www.linkedin.com/profile/view?id=AAkAAAAUPBYBUvwhRxT8bCEs3ZtRallalala',
                id: 'AAkAAAAUPBYBUvwhRxT8bCEs3ZtRallalala'
            },
            {
                type: 'medium',
                type_name: 'Medium',
                url: 'https://medium.com/@salesflare-at',
                id: 'salesflare-at'
            },
            {
                type: 'medium',
                type_name: 'Medium',
                url: 'https://medium.com/salesflare',
                id: 'salesflare'
            },
            {
                type: 'ok',
                type_name: 'Odnoklassniki',
                url: 'https://ok.ru/profile/55212321312',
                id: '55212321312'
            },
            {
                canonical_url: 'https://salesflare.tumblr.com',
                type: 'tumblr',
                type_name: 'Tumblr',
                url: 'https://salesflare.tumblr.com',
                id: 'salesflare'
            },
            {
                canonical_url: 'https://x.com/SlackHQ',
                type: 'twitter',
                type_name: 'Twitter',
                url: 'https://twitter.com/SlackHQ',
                id: 'SlackHQ'
            },
            {
                canonical_url: 'https://x.com/SlackLoveTweets',
                type: 'twitter',
                type_name: 'Twitter',
                url: 'https://twitter.com/SlackLoveTweets',
                id: 'SlackLoveTweets'
            },
            {
                canonical_url: 'https://x.com/mobiletwitter',
                type: 'twitter',
                type_name: 'Twitter',
                url: 'https://mobile.twitter.com/mobiletwitter',
                id: 'mobiletwitter'
            },
            {
                canonical_url: 'https://x.com/xdotcom',
                type: 'twitter',
                type_name: 'Twitter',
                url: 'https://x.com/xdotcom',
                id: 'xdotcom'
            },
            {
                canonical_url: 'https://x.com/wwwxdotcom',
                type: 'twitter',
                type_name: 'Twitter',
                url: 'https://www.x.com/wwwxdotcom',
                id: 'wwwxdotcom'
            },
            {
                canonical_url: 'https://x.com/mobilexdotcom',
                type: 'twitter',
                type_name: 'Twitter',
                url: 'https://mobile.x.com/mobilexdotcom',
                id: 'mobilexdotcom'
            },
            {
                canonical_url: 'https://vk.com/csdwer96123',
                type: 'vk',
                type_name: 'VK',
                url: 'https://vk.com/csdwer96123',
                id: 'csdwer96123'
            },
            {
                canonical_url: 'https://salesflare.wordpress.com',
                type: 'wordpress',
                type_name: 'Wordpress',
                url: 'https://salesflare.wordpress.com',
                id: 'salesflare'
            },
            {
                type: 'yahoo',
                type_name: 'Yahoo',
                url: 'https://local.yahoo.com/josl',
                id: 'josl'
            },
            {
                type: 'yahoo',
                type_name: 'Yahoo',
                url: 'https://profile.yahoo.com/josp',
                id: 'josp'
            },
            {
                type: 'yahoo',
                type_name: 'Yahoo',
                url: 'https://me.yahoo.com/josm',
                id: 'josm'
            },
            {
                type: 'yelp',
                type_name: 'Yelp',
                url: 'https://www.yelp.com/biz/1-2-3-and-me-child-development-center-2-jacksonville',
                id: '1-2-3-and-me-child-development-center-2-jacksonville'
            },
            {
                type: 'yelp',
                type_name: 'Yelp',
                url: 'https://fr.yelp.be/biz/wooly-waterloo',
                id: 'wooly-waterloo'
            },
            {
                type: 'youtube',
                type_name: 'YouTube',
                url: 'https://youtube.com/channel/UCY3YECgeBcLCzIrFLP4gblw',
                id: 'UCY3YECgeBcLCzIrFLP4gblw'
            },
            {
                type: 'youtube',
                type_name: 'YouTube',
                url: 'https://youtube.com/c/UCY3YECgeBcLCzIrFLP4gblc',
                id: 'UCY3YECgeBcLCzIrFLP4gblc'
            },
            {
                type: 'youtube',
                type_name: 'YouTube',
                url: 'https://youtube.com/user/UCY3YECgeBcLCzIrFLP4user',
                id: 'UCY3YECgeBcLCzIrFLP4user'
            },
            {
                type: 'youtube',
                type_name: 'YouTube',
                url: 'https://youtube.com/justchannelname',
                id: 'justchannelname'
            }
        ]);
        expect(result.map((profile) => profile.username)).to.equal(result.map((profile) => profile.id));
        expect(result.length).to.equal(AMOUNT_OF_PROFILES);
    });

    it('keeps query strings, fragments and sentence punctuation out of the id', () => {

        const testText = `
            https://www.facebook.com/slackhq?lang=en
            https://instagram.com/salesflare#bio,
            have a look at (https://x.com/salesflare)
            or at https://github.com/salesflare.
            <a href=https://keybase.io/salesflare>
        `;

        const result = SocialProfileUrlParser.parse(testText);

        expect(result.map(({ username, ...profile }) => profile)).to.equal([ //eslint-disable-line no-unused-vars
            {
                canonical_url: 'https://facebook.com/slackhq',
                type: 'facebook',
                type_name: 'Facebook',
                url: 'https://www.facebook.com/slackhq?lang=en',
                id: 'slackhq'
            },
            {
                canonical_url: 'https://github.com/salesflare',
                type: 'github',
                type_name: 'GitHub',
                url: 'https://github.com/salesflare',
                id: 'salesflare'
            },
            {
                canonical_url: 'https://instagram.com/salesflare',
                type: 'instagram',
                type_name: 'Instagram',
                url: 'https://instagram.com/salesflare#bio',
                id: 'salesflare'
            },
            {
                canonical_url: 'https://keybase.io/salesflare',
                type: 'keybase',
                type_name: 'Keybase',
                url: 'https://keybase.io/salesflare',
                id: 'salesflare'
            },
            {
                canonical_url: 'https://x.com/salesflare',
                type: 'twitter',
                type_name: 'Twitter',
                url: 'https://x.com/salesflare',
                id: 'salesflare'
            }
        ]);
    });

    it('de-duplicates the same profile written with and without a query string', () => {

        const result = SocialProfileUrlParser.parse('https://www.facebook.com/slackhq?lang=en https://www.facebook.com/slackhq');

        expect(result).to.have.length(1);
        expect(result[0].url).to.equal('https://www.facebook.com/slackhq');
    });

    it('leaves a legacy LinkedIn id alone, its `?` belongs to the path', () => {

        const result = SocialProfileUrlParser.parse('https://www.linkedin.com/profile/view?id=AAkAAAAUPBYBUvwhRxT8bCEs3ZtRallalala');

        expect(result[0].id).to.equal('AAkAAAAUPBYBUvwhRxT8bCEs3ZtRallalala');
    });

    it('ignores a url that has no id left once normalized', () => {

        expect(SocialProfileUrlParser.parse('https://github.com/?ref=salesflare')).to.equal([]);
    });

    describe('de-duplication across kinds', () => {

        it('keeps a LinkedIn person and a company that share a slug apart', () => {

            const result = SocialProfileUrlParser.parse('https://linkedin.com/in/foo https://linkedin.com/company/foo');

            expect(result).to.have.length(2);
            expect(result.map((profile) => profile.kind).sort()).to.equal(['company', 'person']);
            expect(result.map((profile) => profile.id)).to.equal(['foo', 'foo']);
        });

        it('keeps a LinkedIn school and a company that share a slug apart', () => {

            const result = SocialProfileUrlParser.parse('https://linkedin.com/school/foo https://linkedin.com/company/foo');

            expect(result).to.have.length(2);
            expect(result.map((profile) => profile.kind).sort()).to.equal(['company', 'school']);
        });

        it('collapses the interchangeable LinkedIn company urls onto one profile', () => {

            const result = SocialProfileUrlParser.parse('https://linkedin.com/company/foo https://linkedin.com/organization/foo https://linkedin.com/companies/foo');

            expect(result).to.have.length(1);
            expect(result[0].kind).to.equal('company');
            expect(result[0].canonical_url).to.equal('https://linkedin.com/company/foo');
        });

        it('keeps a Crunchbase person and a company that share a slug apart', () => {

            const result = SocialProfileUrlParser.parse('https://crunchbase.com/person/foo https://crunchbase.com/organization/foo');

            expect(result).to.have.length(2);
            expect(result.map((profile) => profile.kind).sort()).to.equal(['company', 'person']);
        });

        it('collapses the interchangeable Crunchbase company urls onto one profile', () => {

            const result = SocialProfileUrlParser.parse('https://crunchbase.com/company/foo https://crunchbase.com/organization/foo');

            expect(result).to.have.length(1);
            expect(result[0].kind).to.equal('company');
            expect(result[0].canonical_url).to.equal('https://crunchbase.com/organization/foo');
        });

        it('keeps a Flickr person and a group that share a slug apart', () => {

            const result = SocialProfileUrlParser.parse('https://flickr.com/people/foo https://flickr.com/groups/foo');

            expect(result).to.have.length(2);
            expect(result.map((profile) => profile.kind).sort()).to.equal(['group', 'person']);
        });

        it('collapses a Flickr photostream onto the person behind it', () => {

            const result = SocialProfileUrlParser.parse('https://flickr.com/photos/foo https://flickr.com/people/foo');

            expect(result).to.have.length(1);
            expect(result[0].kind).to.equal('person');
            expect(result[0].canonical_url).to.equal('https://flickr.com/people/foo');
        });

        it('keeps a Facebook page and a group that share a slug apart', () => {

            const result = SocialProfileUrlParser.parse('https://facebook.com/foo https://facebook.com/groups/foo');

            expect(result).to.have.length(2);
            expect(result.map((profile) => profile.kind)).to.equal([undefined, 'group']);
            expect(result.map((profile) => profile.id)).to.equal(['foo', 'foo']);
        });
    });
});
