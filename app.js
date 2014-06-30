var express = require('express'),
    _ = require('underscore'),
    expressHandlebars = require('express3-handlebars'),
    Handlebars = require('handlebars'),
    ntwitter = require('ntwitter'),
    logfmt = require('logfmt'),
    sugar = require('sugar'),
    twitter_credentials = require('./twitter_credentials.json'),
    twitter = ntwitter(twitter_credentials),
    app = express(),
    handlebars;

hbs = expressHandlebars.create({
    defaultLayout: 'main',
    handlebars: Handlebars,
    helpers: {

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

    twitter.get('/statuses/user_timeline.json', {
        screen_name: 'actmdstatus',
        count: 10
    }, function(error, tweets) {

        var first = tweets.shift();

        res.render('index', {
            first_tweet: first,
            tweets: tweets
        });
    });

});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});