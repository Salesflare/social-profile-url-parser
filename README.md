# social-profile-url-parser

Node library to parse social profile urls out of text.

```sh
npm install @salesflare/social-profile-url-parser
```

```js
const SocialProfileUrlParser = require('@salesflare/social-profile-url-parser');

const result = SocialProfileUrlParser.parse(`
    slack   angellist   https://angel.co/slack
    SlackHQ twitter     https://twitter.com/SlackHQ
    slack   linkedin    https://www.linkedin.com/company/tiny-speck-inc
`)
result === [
    {
        type: 'angellist',
        type_name: 'AngelList',
        id: 'slack',
        url: 'https://angel.co/slack',
        canonical_url: 'https://angel.co/slack'
    },
    {
        type: 'linkedin',
        type_name: 'LinkedIn',
        id: 'tiny-speck-inc',
        url: 'https://www.linkedin.com/company/tiny-speck-inc',
        kind: 'company',
        canonical_url: 'https://linkedin.com/company/tiny-speck-inc'
    },
    {
        type: 'twitter',
        type_name: 'Twitter',
        id: 'SlackHQ',
        url: 'https://twitter.com/SlackHQ',
        canonical_url: 'https://x.com/SlackHQ'
    }
];
```

## What you get back

`parse` returns an array with one entry per profile it finds, in the order the types are listed
under [Supported types](#supported-types) rather than the order they appear in the text.

| property | always present | what it holds |
| --- | --- | --- |
| `type` | yes | The platform, one of the keys under [Supported types](#supported-types) |
| `type_name` | yes | The platform's display name, for example `LinkedIn` |
| `id` | yes | The identifying part of the url |
| `url` | yes | The url as it appeared in the text |
| `kind` | no | What the url points at, see [kind](#kind) |
| `canonical_url` | no | The profile in one agreed upon form, see [canonical_url](#canonical_url) |

`id` takes whatever form the platform uses: the profile slug for most types, the subdomain for
Tumblr and WordPress, an opaque or numeric id for Blogger, VK, Odnoklassniki and LinkedIn's legacy
urls, and the business slug for Yelp. It is returned as it was written, so casing is preserved.

`id` holds only the identifying part, so a query string and a fragment are left off:
`facebook.com/slackhq?lang=en` has an `id` of `slackhq`. The one exception is LinkedIn's
`profile/view?id=` urls, where the id is what follows the `?` rather than what precedes it.

`url` keeps the protocol, subdomain, path, query string and fragment that were written, so you can
always show or store the url as it was found. The only thing dropped is punctuation that closed the
sentence around it, so a url written as `(https://x.com/salesflare).` does not come back carrying
`).`. Use `canonical_url` when you want to compare two urls.

Results are de-duplicated on `type` plus `id`. A profile that appears twice in the same text
written two different ways collapses into one entry, holding the last `url` seen. Since the query
string is not part of `id`, `facebook.com/slackhq` and `facebook.com/slackhq?lang=en` count as the
same profile.

### Deprecated: `username`

`id` was called `username` before 3.0.0. Every result still carries a `username` property holding
the same value throughout 3.x, so existing code keeps working, but it will be removed in 4.0.0.
Move to `id`.

## kind

`kind` says what the url points at, for the four platforms that address more than one thing under
the same domain. It is always one of the same four values, whatever the platform calls it in its
own urls, so you can branch on it without knowing that a LinkedIn person lives under `/in/`:

| kind | matched urls |
| --- | --- |
| `company` | Crunchbase `/company/` and `/organization/`, LinkedIn `/company/`, `/companies/` and `/organization/` |
| `group` | Facebook `/groups/`, Flickr `/groups/`, LinkedIn `/groups/` |
| `person` | Crunchbase `/person/`, Flickr `/people/` and `/photos/`, LinkedIn `/in/`, `/pub/`, `/people/`, `/sales/people/` and `/profile/view?id=` |
| `school` | LinkedIn `/edu/` and `/school/` |

`kind` is left out for every other type, and for a Facebook url that is not a group, since a plain
`facebook.com/name` can be either a person or a page.

## canonical_url

`url` is the url as it was found in the text. `canonical_url` is the same profile in one agreed
upon form, so that `https://twitter.com/SlackHQ`, `https://www.x.com/SlackHQ` and
`https://mobile.x.com/SlackHQ` all come back as `https://x.com/SlackHQ`. It normalizes the protocol,
the `www`/`mobile`/country subdomain, the domain where a platform has more than one, and the path
where a platform has several interchangeable forms, for example LinkedIn `/companies/` and
`/organization/` to `/company/`, and Crunchbase `/company/` to `/organization/`.

`canonical_url` is left out entirely when the matched url cannot be rewritten without guessing,
which is the case for two groups of urls. The first is types whose regex matches things that are
not interchangeable: a country site that is a separate site, a subdomain that means something
different, or a path segment that is optional and therefore ambiguous. The second is LinkedIn
`/pub/`, `/people/`, `/sales/people/` and `/profile/view?id=` urls, which carry a legacy or opaque
member id rather than a public slug. Those still report a `kind`, so a url can tell you it is a
person without being canonicalizable.

The last column of the table below says which types get one. Always check the field is present
before using it.

## Supported types

Every type accepts `http` or `https` and an optional `www.`, and the types with localized sites
also accept a country subdomain such as `au.linkedin.com` or `nl-nl.facebook.com`.

| type | type_name | matched urls | canonical_url |
| --- | --- | --- | --- |
| `aboutme` | About.me | `about.me/{id}` | yes |
| `angellist` | AngelList | `angel.co/{id}` | yes |
| `behance` | Behance | `behance.com/{id}`, `behance.net/{id}` | yes |
| `blogger` | Blogger | `blogger.com/profile/{id}` | yes |
| `coinbase` | Coinbase | `coinbase.com/{id}` | yes |
| `crunchbase` | CrunchBase | `crunchbase.com/{person,company,organization}/{id}` | yes |
| `delicious` | Delicious | `delicious.com/{id}` | yes |
| `digg` | Digg | `digg.com/users/{id}` | yes |
| `dribbble` | Dribbble | `dribbble.com/{id}` | yes |
| `facebook` | Facebook | `facebook.com/{id}`, `fb.com/{id}`, `facebook.com/groups/{id}` | yes |
| `flickr` | Flickr | `flickr.com/{people,photos,groups}/{id}` | yes |
| `foursquare` | Foursquare | `foursquare.com/{id}`, `foursquare.com/user/{id}` | no |
| `github` | GitHub | `github.com/{id}` | yes |
| `gravatar` | Gravatar | `gravatar.com/{id}` | yes |
| `instagram` | Instagram | `instagram.com/{id}` | yes |
| `keybase` | Keybase | `keybase.io/{id}` | yes |
| `lastfm` | Last.FM | `last.fm/user/{id}`, `lastfm.com/user/{id}` | yes |
| `linkedin` | LinkedIn | `linkedin.com/{in,pub,people,company,companies,organization,edu,school,groups}/{id}`, `linkedin.com/sales/people/{id}`, `linkedin.com/profile/view?id={id}` | yes\* |
| `medium` | Medium | `medium.com/@{id}`, `medium.com/{id}` | no |
| `myspace` | MySpace | `myspace.com/{id}` | yes |
| `ok` | Odnoklassniki | `ok.ru/{id}`, `ok.ru/profile/{id}` | no |
| `pandora` | Pandora | `pandora.com/people/{id}` | yes |
| `pinterest` | Pinterest | `pinterest.{tld}/{id}` | no |
| `plancast` | Plancast | `plancast.com/{id}` | yes |
| `quora` | Quora | `quora.com/{id}`, `quora.com/profile/{id}` | no |
| `reddit` | Reddit | `reddit.com/user/{id}` | yes |
| `slideshare` | Slideshare | `slideshare.net/{id}` | yes |
| `tumblr` | Tumblr | `{id}.tumblr.com` | yes |
| `twitter` | Twitter | `twitter.com/{id}`, `x.com/{id}` | yes |
| `vimeo` | Vimeo | `vimeo.com/{id}` | yes |
| `vk` | VK | `vk.com/{id}` | yes |
| `wordpress` | Wordpress | `{id}.wordpress.com` | yes |
| `xing` | Xing | `xing.com/{id}`, `xing.com/profile/{id}` | no |
| `yahoo` | Yahoo | `{profile,me,local}.yahoo.com/{id}` | no |
| `yelp` | Yelp | `yelp.{tld}/biz/{id}` | no |
| `youtube` | YouTube | `youtube.com/{id}`, `youtube.com/{user,channel,c}/{id}` | no |

\* every LinkedIn url except `/pub/`, `/people/`, `/sales/people/` and `/profile/view?id=`.

`type` is the value to store and branch on, since it stays put. `type_name` is only a display name
and may be retitled if a platform rebrands.

`x.com` is matched as `type: 'twitter'` so that existing stored profiles keep working. Only
`canonical_url` uses the `x.com` domain.
