var CACHE_FILE = './cache/tweets.json',
    CACHE_DATE_FILE = './cache/date.json',
    CACHE_AGE_SECONDS = 60000,
    express = require('express'),
    _ = require('underscore'),
    expressHandlebars = require('express-handlebars'),
    Handlebars = require('handlebars'),
    ntwitter = require('ntwitter'),
    logfmt = require('logfmt'),
    sugar = require('sugar'),
    jsonfile = require('jsonfile'),
    app = express(),
    handlebars,
    twitter_credentials,
    twitter;

try {
    // Try to load the credentials from a file
    twitter_credentials = require('./twitter_credentials.json');
} catch (e) {
    // Otherwise, pull from environment variables
    twitter_credentials = {
        "consumer_key":        process.env.TWITTER_CONSUMER_KEY,
        "consumer_secret":     process.env.TWITTER_CONSUMER_SECRET,
        "access_token_key":    process.env.TWITTER_TOKEN_KEY,
        "access_token_secret": process.env.TWITTER_TOKEN_SECRET
    }
} finally {
    twitter = ntwitter(twitter_credentials)
}

try {
    // Try to load application configuration from a file
    config = require('./config.json');
} catch (e) {
    // Otherwise, pull from environment variables
    config = {
        "application_name": process.env.APPLICATION_NAME,
        "twitter_handle":   process.env.TWITTER_HANDLE,
        "number_of_tweets": process.env.NUMBER_OF_TWEETS,
        "help_email":       process.env.HELP_EMAIL,
        "copyright":        process.env.COPYRIGHT
    }
}

hbs = expressHandlebars.create({
    defaultLayout: false,
    handlebars:    Handlebars,
    helpers:       {

        statusClass: function(hashtags) {

            var tags = _.pluck(hashtags, 'text');

            if (_.contains(tags, "ok")) {
                return "status-ok";
            } else if (_.contains(tags, "maintenance")) {
                return "status-maintenance";
            } else if (_.contains(tags, "issue")) {
                return "status-issue";
            } else {
                console.log("No applicable hashtag for status class: " + hashtags);
                return "status-default";
            }

        },

        friendlyDate: function(date) {
            return Date.create(date).format("{Weekday}, {Month} {dd}, {yyyy}");
        },

        friendlyTime: function(date) {
            return Date.create(date).format("{12hr}:{mm} {tt} {tz}");
        }

    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {

    try {
        var cache_date = jsonfile.readFileSync(CACHE_DATE_FILE);

        // Cache date is still fresh...
        if ('date' in cache_date && Date.now() - CACHE_AGE_SECONDS < cache_date.date) {
            // ... so render from the cache
            console.log("Loading tweets from cache...");
            renderTweets(res, jsonfile.readFileSync(CACHE_FILE));
        } else {
            console.log("Cache too old, fetching tweets anew...");
            fetchTweets(res);
        }
    } catch (e) {
        fetchTweets(res);
    }

});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});

function fetchTweets(res) {
    twitter.get(
        '/statuses/user_timeline.json',

        {
            screen_name: config.twitter_handle,
            count:       config.number_of_tweets
        },

        function(error, tweets) {

            // Cache tweets on disk
            console.log("Saving new tweets to cache...");
            jsonfile.writeFileSync(CACHE_FILE, tweets);
            jsonfile.writeFileSync(CACHE_DATE_FILE, { "date" : Date.now() });

            renderTweets(res, tweets);

        }
    );
}

function renderTweets(res, tweets) {
    var first = tweets && tweets.length && tweets.shift();

    res.render('index', {
        config:      config,
        first_tweet: first,
        tweets:      tweets
    });
}
