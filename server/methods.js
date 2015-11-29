Meteor.methods({
    checkTwitter: function (tags) {   //remote method for tests
        return twitter.search(tags, 5);
    }
});

Meteor.publish('posts', function (query, qty) {
    if (!qty) qty = 5;
    let result = twitter.search(query, qty);
    result.data.statuses.forEach((item) => {
        this.added('tweets', Random.id(), _.omit(item, 'id')); //generating new collection that will be only in client (MiniMongoDB)
    });
    return this.ready();
});


class TwitterApi {
    constructor(options) {
        this._url = "https://api.twitter.com";
        this._version = "1.1";
        this.app_auth_token = "";
        if (options) _.extend(this, options);
    }

    _getUrl(url) {
        return [this._url, this._version, url].join('/');
    }

    get(url, params) {
        return this.call('GET', url, params);
    }

    post(url, params) {
        return this.call('POST', url, params);
    }

    call(method, url, params) {
        //this.unblock();

        oauthBinding = this.getOauthBindingForCurrentUser();

        result = oauthBinding.call(method,
            this._getUrl(url),
            params
        );

        return result;
    }

    callAsApp(method, url, params) {

        this.createApplicationToken();

        result = Meteor.http.call(method,
            this._getUrl(url), {
                params: params,
                headers: {
                    'Authorization': 'Bearer ' + this.app_auth_token
                }
            });

        return result;
    }

    getOauthBinding() {
        let config = Accounts.loginServiceConfiguration.findOne({service: 'twitter'});

        let urls = {
            requestToken: "https://api.twitter.com/oauth/request_token",
            authorize: "https://api.twitter.com/oauth/authorize",
            accessToken: "https://api.twitter.com/oauth/access_token",
            authenticate: "https://api.twitter.com/oauth/authenticate"
        };

        return new OAuth1Binding(config, urls);
    }

    getOauthBindingForCurrentUser() {
        let oauthBinding = this.getOauthBinding();

        let user = this.userId ? Meteor.users.findOne(this.userId) : Meteor.user();

        oauthBinding.accessToken = user.services.twitter.accessToken;
        oauthBinding.accessTokenSecret = user.services.twitter.accessTokenSecret;

        return oauthBinding;
    }

    publicTimeline() {
        return this.get('statuses/sample.json');
    }

    userTimeline() {
        return this.get('statuses/user_timeline.json');
    }

    homeTimeline() {
        return this.get('statuses/home_timeline.json');
    }

    postTweet(text, reply_to) {
        tweet = {
            status: text,
            in_reply_to_status_id: reply_to || null
        };

        return this.post('statuses/update.json', tweet);
    }

    follow(screenName) {
        return this.post('friendships/create.json', {screen_name: screenName, follow: true});
    }

    getLists(user) {
        if (user) {
            return this.get("lists/list.json", {
                screen_name: user
            });
        } else {
            return this.get("lists/list.json");
        }
    }

    getListMembers(listId, cursor) {
        if (cursor === null) {
            cursor = "-1";
        }
        return this.get("lists/members.json", {
            list_id: listId,
            cursor: cursor
        });
    }

    usersSearch(query, page, count, includeEntities) {
        if (page === null) {
            page = 0;
        }
        if (count === null) {
            count = 10;
        }
        if (includeEntities === null) {
            includeEntities = true;
        }
        return this.get("users/search.json", {
            q: query,
            page: page,
            count: count,
            include_entities: includeEntities
        });
    }

    search(query, count) {
        if (count) {
            return this.callAsApp('GET', 'search/tweets.json', {
                'q': query,
                'count': count
            });
        } else {
            return this.callAsApp('GET', 'search/tweets.json', {
                'q': query
            });
        }
    }

    createApplicationToken() {
        let url = 'https://api.twitter.com/oauth2/token'
        let config = Accounts.loginServiceConfiguration.findOne({service: 'twitter'});
        let base64AuthToken = new Buffer(config.consumerKey + ":" + config.secret).toString('base64');

        let result = Meteor.http.post(url, {
            params: {
                'grant_type': 'client_credentials'
            },
            headers: {
                'Authorization': 'Basic ' + base64AuthToken,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        });
        this.app_auth_token = result.data.access_token;
        return this.app_auth_token;
    }

}

//create TwitterApi instance

let twitter = new TwitterApi();