//@ts-check
'use strict';

const internals = {
    regexes:  {
        'aboutme': /https?:\/\/(www\.)?about\.me\/([^ /\n]+)/ig,
        'angellist': /https?:\/\/(www\.)?angel\.co\/([^ /\n]+)/ig,
        'behance': /https?:\/\/(www\.)?behance\.(com|net)\/([^ /\n]+)/ig,
        'blogger': /https?:\/\/(www\.)?blogger\.com\/profile\/([^ /\n]+)/ig,
        'coinbase': /https?:\/\/(www\.)?coinbase\.com\/([^ /\n]+)/ig,
        'crunchbase': /https?:\/\/(www\.)?crunchbase\.com\/(person|company)\/([^ /\n]+)/ig,
        'delicious': /https?:\/\/(www\.)?delicious\.com\/([^ /\n]+)/ig,
        'digg': /https?:\/\/(www\.)?digg\.com\/users\/([^ /\n]+)/ig,
        'dribbble': /https?:\/\/(www\.)?dribbble\.com\/([^ /\n]+)/ig,
        'facebook': /https?:\/\/(www\.)?(facebook|fb)\.com\/([^ /\n]+)/ig,
        'flickr': /https?:\/\/(www\.)?flickr\.com\/people\/([^ /\n]+)/ig,
        'foursquare': /https?:\/\/(www\.)?foursquare\.com\/(user\/)?([^ /\n]+)/ig,
        'github': /https?:\/\/(www\.)?github\.com\/([^ /\n]+)/ig,
        'google-plus': /https?:\/\/plus\.google\.com\/u\/0\/\+?([^ /\n]+)/ig,
        'gravatar': /https?:\/\/(www\.)?gravatar\.com\/([^ /\n]+)/ig,
        'instagram': /https?:\/\/(www\.)?instagram\.com\/([^ /\n]+)/ig,
        'keybase': /https?:\/\/(www\.)?keybase\.io\/([^ /\n]+)/ig,
        'klout': /https?:\/\/(www\.)?klout\.com\/([^ /\n]+)/ig,
        'lastfm': /https?:\/\/(www\.)?(last\.fm|lastfm\.com)\/user\/([^ /\n]+)/ig,
        'linkedin': /https?:\/\/(www\.)?linkedin.com\/(in|pub)\/([^ \n]+)/ig,
        'medium': /https?:\/\/(www\.)?medium\.com\/@([^ /\n]+)/ig,
        'myspace': /https?:\/\/(www\.)?myspace\.com\/([^ /\n]+)/ig,
        'pandora': /https?:\/\/(www\.)?pandora\.com\/people\/([^ /\n]+)/ig,
        'picasa': /https?:\/\/picasaweb\.google\.com\/([^ /\n]*)/ig,
        'pinterest': /https?:\/\/(www\.)?pinterest\.[a-zA-Z.]+\/([^ +/\n]+)/ig,
        'plancast': /https?:\/\/(www\.)?plancast\.com\/([^ /\n]+)/ig,
        'quora': /https?:\/\/(www\.)?quora.com\/(profile\/)?([^ /\n]+)/ig,
        'reddit': /https?:\/\/(www\.)?reddit\.com\/user\/([^ /\n]+)/ig,
        'slideshare': /https?:\/\/(www\.)?slideshare\.net\/([^ /\n]+)/ig,
        'tumblr': /https?:\/\/(.+)\.tumblr\.com/ig,
        'twitter': /https?:\/\/(www\.)?twitter\.com\/([^ /\n]+)/ig,
        'vimeo': /https?:\/\/(www\.)?vimeo\.com\/([^ /\n]+)/ig,
        'wordpress': /https?:\/\/((?!subscribe).+)\.wordpress\.com/ig,
        'xing': /https?:\/\/(www\.)?xing\.com\/(profile\/)?([^ /\n]+)/ig,
        'yahoo': /https?:\/\/((profile|me)\.)?yahoo\.com\/([^ /\n]+)/ig,
        'youtube': /https?:\/\/(www\.)?youtube\.com\/(user|channel)\/([^ /\n]+)/ig
    }
};

/**
 * @typedef {Object} parseResult
 * @property {String} type
 * @property {String} username
 * @property {String} url
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
            const username = result[result.length - 1];

            resultsMap.set(`${type}|${username}`, {
                type,
                username,
                url: result[0]
            });
        }
    });

    return [...resultsMap.values()];
};
