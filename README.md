node-system-status
==================

Create your own webapp status page with a Twitter account and this tiny Node.js app

# The basics

At ACT.md, we [use Twitter](https://twitter.com/actmdstatus) to notify our users of upcoming maintenance or, heaven forbid, an unplanned outage. node-system-status shows those messages in a clean and professional way, distinguishing between issues (red), maintenance notices (yellow), and all-clear messages (green) using the hashtags **#issue**, **#maintenance**, and **#ok**.

# Running locally

## Abbreviated four-step process

Assuming you have Node.js and [foreman](https://github.com/strongloop/node-foreman) installed.

1. Clone the repo and `npm install` the dependencies
2. Copy `config.orig.json` to `config.json` and customize
3. Copy `twitter_credentials.json` to `twitter_credentials.json` and customize
4. `foreman start` and visit [http://localhost:5000](http://localhost:5000)

## Detailed instructions

1. Clone the repo
2. Open a terminal window in that directory and install the npm dependencies
  * `npm install`
2. Install the [Heroku Toolbelt](https://toolbelt.heroku.com/) if you plan on deploying on Heroku, or just install [foreman](https://github.com/strongloop/node-foreman) to test locally.
  * `npm install -g foreman`
2. Copy `config.orig.json` to `config.json` and update it with your own values.
  * `application_name`: The name of your application, e.g. `ACT.md`
  * `twitter_handle`: Twitter username you use to post application updates, e.g. `actmdstatus`
  * `number_of_tweets`: Total number of status tweets to show, e.g. `10`
  * `help_email`: E-mail address your users should contact if they need additional assistance
  * `copyright`: Official name for your copyright notice, e.g. `Accountable Care Transactions, Inc`
3. Create a Twitter API Key and Access Token for node-system-status to use
  1. Sign into the [Twitter Application Management site](https://apps.twitter.com/) and click "Create a new app," the "app" being your new Twitter-based application status website.
  2. Fill out the form. Leave *Callback URL* empty.
  3. With your app created, click the "API Keys" tab. You'll see your *API Key* and *API Secret* waiting for you.
  4. At the bottom, click "Create my access token."
  5. Wait for the token to appear. You'll see an *Access Token* and *Access Token Secret*.
4. Copy `twitter_credentials.orig.json` to `twitter_credentials.json` and update it with the above keys & secrets.
  * `consumer_key`: Your Twitter API Key
  * `consumer_secret`: Your Twitter API Secret
  * `access_token_key`: Your Twitter Access Token
  * `access_token_secret`: Your Twitter Access Token Secret
5. Start your app
  * `foreman start`
  * Visit [http://localhost:5000](http://localhost:5000)
6. Post status messages to your Twitter account. Messages must include a recognized hashtag to appear.
  * **#ok** (renders in green)
  * **#maintenance** (renders in yellow)
  * **#issue** (renders in red)

# Deploying to Heroku

## Abbreviated four-step process

1. Clone the repo
2. `heroku login` and `heroku create`
3. Set all the application variables. (See step 5 below)
4. `git push heroku master` and open in a browser.

## Detailed instructions

1. Install the [Heroku Toolbelt](https://toolbelt.heroku.com/) and create a Heroku account, if you don't have one.
2. Clone the repo and open a terminal window in that directory
3. Log into Heroku
  * `heroku login`
4. Create a new Heroku app instance
  * `heroku create`
5. Set all the application variables
  * `heroku config:set APPLICATION_NAME=...`
  * `heroku config:set TWITTER_HANDLE=...`
  * `heroku config:set NUMBER_OF_TWEETS=...`  
  * `heroku config:set HELP_EMAIL=...`
  * `heroku config:set COPYRIGHT=...`
  * `heroku config:set TZ=<your_timezone>`
  * `heroku config:set TWITTER_CONSUMER_KEY=...`
  * `heroku config:set TWITTER_CONSUMER_SECRET=...`
  * `heroku config:set TWITTER_TOKEN_KEY=...`
  * `heroku config:set TWITTER_TOKEN_SECRET=...`
6. Deploy to your Heroku instance
  * `git push heroku master`
7. Note the URL that's displayed in the response and open that in your browser.

