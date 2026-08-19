//@ts-check
'use strict';

const internals = {
    // We sometimes use [A-Za-z_]{0,3} instead of www since there are localized urls like au.linkedin.com
    // The {0,3} will get flagged as unsafe but I have not found a better solution yet
    regexes: {
        'aboutme': /https?:\/\/(www\.)?about\.me\/([^ "/\n]+)/ig,
        'angellist': /https?:\/\/(www\.)?angel\.co\/([^ "/\n]+)/ig,
        'behance': /https?:\/\/(www\.)?behance\.(com|net)\/([^ "/\n]+)/ig,
        'blogger': /https?:\/\/(www\.)?blogger\.com\/profile\/([^ "/\n]+)/ig,
        'coinbase': /https?:\/\/(www\.)?coinbase\.com\/([^ "/\n]+)/ig,
        'crunchbase': /https?:\/\/(www\.)?crunchbase\.com\/(person|company|organization)\/([^ "/\n]+)/ig,
        'delicious': /https?:\/\/(www\.)?delicious\.com\/([^ "/\n]+)/ig,
        'digg': /https?:\/\/(www\.)?digg\.com\/users\/([^ "/\n]+)/ig,
        'dribbble': /https?:\/\/(www\.)?dribbble\.com\/([^ "/\n]+)/ig,
        'facebook': /https?:\/\/([A-Za-z_]{0,3}\.|[A-Za-z_]{2}-[A-Za-z_]{2}\.)?(facebook|fb)\.com\/(groups\/)?([^ "/\n]+)/ig, //eslint-disable-line unicorn/no-unsafe-regex
        'flickr': /https?:\/\/(www\.)?flickr\.com\/(people|photos|groups)\/([^ "/\n]+)/ig,
        'foursquare': /https?:\/\/(www\.)?foursquare\.com\/(user\/)?([^ "/\n]+)/ig,
        'github': /https?:\/\/(www\.)?github\.com\/([^ "/\n]+)/ig,
        'gravatar': /https?:\/\/([A-Za-z_]{0,3}\.)?gravatar\.com\/([^ "/\n]+)/ig, //eslint-disable-line unicorn/no-unsafe-regex
        'instagram': /https?:\/\/(www\.)?instagram\.com\/([^ "/\n]+)/ig,
        'keybase': /https?:\/\/(www\.)?keybase\.io\/([^ "/\n]+)/ig,
        'lastfm': /https?:\/\/(www\.)?(last\.fm|lastfm\.com)\/user\/([^ "/\n]+)/ig,
        // The `profile/view?id=` id has to start with a letter to rule out the numeric legacy ids,
        // asserted with a lookahead so the first character stays part of the id
        'linkedin': /https?:\/\/([A-Za-z_]{0,3}\.)?linkedin\.com\/(((sales\/)?(in|pub|people|company|companies|organization|edu|school|groups)\/)|(profile\/view\?id=(?=[a-zA-Z])))([^ "/\n]+)/ig,  //eslint-disable-line unicorn/no-unsafe-regex
        'medium': /https?:\/\/(www\.)?medium\.com\/@?([^ "/\n]+)/ig,
        'myspace': /https?:\/\/(www\.)?myspace\.com\/([^ "/\n]+)/ig,
        'ok': /https?:\/\/(www\.)?ok\.ru\/(profile\/)?([^ "/\n]+)/ig,
        'pandora': /https?:\/\/(www\.)?pandora\.com\/people\/([^ "/\n]+)/ig,
        'pinterest': /https?:\/\/([A-Za-z_]{0,3}\.)?pinterest\.[a-zA-Z.]+\/([^ +/\n]+)/ig,  //eslint-disable-line unicorn/no-unsafe-regex
        'plancast': /https?:\/\/(www\.)?plancast\.com\/([^ "/\n]+)/ig,
        'quora': /https?:\/\/(www\.)?quora\.com\/(profile\/)?([^ "/\n]+)/ig,
        'reddit': /https?:\/\/(www\.)?reddit\.com\/user\/([^ "/\n]+)/ig,
        'slideshare': /https?:\/\/(www\.)?slideshare\.net\/([^ "/\n]+)/ig,
        'tumblr': /https?:\/\/(.+)\.tumblr\.com/ig,
        'twitter': /https?:\/\/((www|mobile)\.)?(twitter|x)\.com\/([^ "/\n]+)/ig,
        'vimeo': /https?:\/\/(www\.)?vimeo\.com\/([^ "/\n]+)/ig,
        'vk': /https?:\/\/(www\.)?vk\.com\/([^ "/\n]+)/ig,
        'wordpress': /https?:\/\/((?!subscribe).+)\.wordpress\.com/ig,
        'xing': /https?:\/\/(www\.)?xing\.com\/(profile\/)?([^ "/\n]+)/ig,
        'yahoo': /https?:\/\/((profile|me|local)\.)?yahoo\.com\/([^ "/\n]+)/ig,
        'yelp': /https?:\/\/([A-Za-z_]{0,3}\.)?yelp\.[a-zA-Z]{2,}\/biz\/([^ "/\n]+)/ig, //eslint-disable-line unicorn/no-unsafe-regex
        'youtube': /https?:\/\/([A-Za-z_]{0,3}\.)?youtube\.com\/(user\/|channel\/|c\/)?([^ "/\n]+)/ig  //eslint-disable-line unicorn/no-unsafe-regex
    },
    // Indexes of the capture groups holding the url "kind", for the types that have one. The first
    // group that took part in the match wins, so alternations can list one group per branch
    kindGroups: new Map([
        ['crunchbase', [2]],
        ['facebook', [3]],
        ['flickr', [2]],
        ['linkedin', [5, 6]]
    ]),
    // Every url kind the corresponding regex can match, folded onto the kind that gets reported.
    // The reported kinds are the same four values for every type, `company`, `group`, `person` and
    // `school`, so callers never have to know how a platform words its own urls
    kindMaps: new Map([
        ['crunchbase', new Map([
            ['company', 'company'],
            ['organization', 'company'],
            ['person', 'person']
        ])],
        ['facebook', new Map([
            ['groups/', 'group']
        ])],
        ['flickr', new Map([
            ['groups', 'group'],
            // `photos` is the photostream of the person behind `people`
            ['people', 'person'],
            ['photos', 'person']
        ])],
        ['linkedin', new Map([
            ['companies', 'company'],
            ['company', 'company'],
            ['edu', 'school'],
            ['groups', 'group'],
            ['in', 'person'],
            ['organization', 'company'],
            ['people', 'person'],
            ['profile/view?id=', 'person'],
            ['pub', 'person'],
            ['school', 'school']
        ])]
    ]),
    // How a reported kind is spelled in a canonical url, which is the only place a platform's own
    // wording is still needed
    kindPathMaps: new Map([
        ['crunchbase', new Map([
            // `company` is the legacy form and redirects to `organization`
            ['company', 'organization'],
            ['person', 'person']
        ])],
        ['facebook', new Map([
            ['group', 'groups']
        ])],
        ['flickr', new Map([
            ['group', 'groups'],
            ['person', 'people']
        ])],
        ['linkedin', new Map([
            ['company', 'company'],
            ['group', 'groups'],
            ['person', 'in'],
            ['school', 'school']
        ])]
    ]),
    // Matched kinds whose url holds a legacy or opaque identifier rather than a public slug. The
    // kind is still reported, but the identifier cannot be rebuilt into a working canonical url
    unresolvableKinds: new Map([
        ['linkedin', new Set(['people', 'profile/view?id=', 'pub'])]
    ]),
    // `{kind}` drops out together with the slash behind it when a match has no kind, so an optional
    // kind segment is written the same way as a mandatory one.
    // A type without a template has no canonical url on purpose, either because its regex matches
    // domains or subdomains that are not interchangeable (pinterest, yahoo, yelp) or because the
    // matched url is ambiguous (foursquare, medium, ok, quora, xing, youtube)
    urlTemplateMap: new Map([
        ['aboutme', 'https://about.me/{id}'],
        ['angellist', 'https://angel.co/{id}'],
        ['behance', 'https://behance.net/{id}'],
        ['blogger', 'https://blogger.com/profile/{id}'],
        ['coinbase', 'https://coinbase.com/{id}'],
        ['crunchbase', 'https://crunchbase.com/{kind}/{id}'],
        ['delicious', 'https://delicious.com/{id}'],
        ['digg', 'https://digg.com/users/{id}'],
        ['dribbble', 'https://dribbble.com/{id}'],
        ['facebook', 'https://facebook.com/{kind}/{id}'],
        ['flickr', 'https://flickr.com/{kind}/{id}'],
        ['github', 'https://github.com/{id}'],
        ['gravatar', 'https://gravatar.com/{id}'],
        ['instagram', 'https://instagram.com/{id}'],
        ['keybase', 'https://keybase.io/{id}'],
        ['lastfm', 'https://last.fm/user/{id}'],
        ['linkedin', 'https://linkedin.com/{kind}/{id}'],
        ['myspace', 'https://myspace.com/{id}'],
        ['pandora', 'https://pandora.com/people/{id}'],
        ['plancast', 'https://plancast.com/{id}'],
        ['reddit', 'https://reddit.com/user/{id}'],
        ['slideshare', 'https://slideshare.net/{id}'],
        ['tumblr', 'https://{id}.tumblr.com'],
        // Twitter.com redirects to x.com, the type stays `twitter` for backwards compatibility
        ['twitter', 'https://x.com/{id}'],
        ['vimeo', 'https://vimeo.com/{id}'],
        ['vk', 'https://vk.com/{id}'],
        ['wordpress', 'https://{id}.wordpress.com']
    ]),
    typeNameMap: new Map([
        ['aboutme', 'About.me'],
        ['angellist', 'AngelList'],
        ['behance', 'Behance'],
        ['blogger', 'Blogger'],
        ['coinbase', 'Coinbase'],
        ['crunchbase', 'CrunchBase'],
        ['delicious', 'Delicious'],
        ['digg', 'Digg'],
        ['dribbble', 'Dribbble'],
        ['facebook', 'Facebook'],
        ['flickr', 'Flickr'],
        ['foursquare', 'Foursquare'],
        ['github', 'GitHub'],
        ['gravatar', 'Gravatar'],
        ['instagram', 'Instagram'],
        ['keybase', 'Keybase'],
        ['lastfm', 'Last.FM'],
        ['linkedin', 'LinkedIn'],
        ['medium', 'Medium'],
        ['myspace', 'MySpace'],
        ['ok', 'Odnoklassniki'],
        ['pandora', 'Pandora'],
        ['pinterest', 'Pinterest'],
        ['plancast', 'Plancast'],
        ['quora', 'Quora'],
        ['reddit', 'Reddit'],
        ['slideshare', 'Slideshare'],
        ['tumblr', 'Tumblr'],
        ['twitter', 'Twitter'],
        ['vimeo', 'Vimeo'],
        ['vk', 'VK'],
        ['wordpress', 'Wordpress'],
        ['xing', 'Xing'],
        ['yahoo', 'Yahoo'],
        ['yelp', 'Yelp'],
        ['youtube', 'YouTube']
    ])
};

/**
 * Reads the url kind out of a match and folds it onto the kind that gets reported.
 *
 * @param {String} type
 * @param {Array<String>} result A regex match
 * @returns {{ matchedKind?: String, kind?: String }} Empty when the type has no kind, or when the
 * match left an optional kind group out
 */
internals.resolveKind = (type, result) => {

    const kindMap = internals.kindMaps.get(type);
    const matchedKind = (internals.kindGroups.get(type) || []).map((group) => result[group]).find(Boolean);

    if (!kindMap || !matchedKind) {
        return {};
    }

    const lowerCasedKind = matchedKind.toLowerCase();

    return { matchedKind: lowerCasedKind, kind: kindMap.get(lowerCasedKind) };
};

/**
 * Builds the canonical url for a match.
 *
 * @param {String} type
 * @param {String} id
 * @param {String} [matchedKind] The kind as it appeared in the url
 * @param {String} [kind] The reported kind
 * @returns {String|undefined} `undefined` when the type has no template, or when the kind cannot be
 * rebuilt into a working url
 */
internals.buildCanonicalUrl = (type, id, matchedKind, kind) => {

    const template = internals.urlTemplateMap.get(type);

    if (!template) {
        return;
    }

    const unresolvableKinds = internals.unresolvableKinds.get(type);

    if (unresolvableKinds && unresolvableKinds.has(matchedKind)) {
        return;
    }

    const kindPath = kind && internals.kindPathMaps.get(type).get(kind);

    return template.replace('{kind}/', kindPath ? `${kindPath}/` : '').replace('{id}', id);
};

/**
 * @typedef {Object} parseResult
 * @property {String} type
 * @property {String} type_name
 * @property {String} id The identifying part of the url
 * @property {String} username Deprecated alias of `id`, removed in 4.0.0
 * @property {String} url
 * @property {String} [kind] What the url points at, one of `company`, `group`, `person` or `school`
 * @property {String} [canonical_url] Left out when the url cannot be canonicalized unambiguously
 */

/**
 *
 * @param {String} inputText
 * @returns {Array<parseResult>}
 */
exports.parse = (inputText) => {

    const resultsMap = new Map();
    Object.entries(internals.regexes).forEach(([type, regex]) => {

        // While loop is needed to process multiple matches from 1 regex
        let result;
        while ((result = regex.exec(inputText)) !== null) {
            const id = result[result.length - 1];
            const { matchedKind, kind } = internals.resolveKind(type, result);
            const canonicalUrl = internals.buildCanonicalUrl(type, id, matchedKind, kind);

            // Every type in `regexes` has a name, so the fallback is unreachable. It is kept so
            // that adding a regex without adding a name cannot produce an undefined `type_name`
            /* $lab:coverage:off$ */
            const typeName = internals.typeNameMap.get(type) || 'other';
            /* $lab:coverage:on$ */

            const parsedProfile = {
                type,
                id,
                // Deprecated alias of `id`, removed in 4.0.0
                username: id,
                url: result[0],
                type_name: typeName
            };

            if (kind) {
                parsedProfile.kind = kind;
            }

            if (canonicalUrl) {
                parsedProfile.canonical_url = canonicalUrl;
            }

            resultsMap.set(`${type}|${id}`, parsedProfile);
        }
    });

    return [...resultsMap.values()];
};
