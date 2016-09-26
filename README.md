# \<polymer-twitter-realtimeline\>

Twitter real timeline. It will track a 'active' hashtag from firebase

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## config.json file

Create a [Twitter App](https://apps.twitter.com/), config it, get the necessary keys and tokens and put then in config.json file

```json
{
    "consumer_secret": "your_consumer_secret",
    "consumer_key": "your_consumer_key",
    "token": "your_token",
    "token_secret": "your_secret"
}
```

## Firebase
You will need to create and set up a [Firebase Realtime Database](https://firebase.google.com/docs/database/) 
and in demo index file configure the firebase-app component

```html
<firebase-app
          auth-domain="your_your_auth_domain"
          database-url="your_data_url"
          api-key="your_api_key"
          storage-bucket="your_storage_bucket"></firebase-app>
```
The database mush have a path, you can change it in demo code. By default (active/hashtag/to/track)

![path](https://cloud.githubusercontent.com/assets/10350688/18666822/1b2f229e-7f2e-11e6-947c-40214ea45330.png)

## Server up and Running

```html
$ npm install
$ node twitter_stream/app.js
```

## Viewing Your Application

```
$ bower install
$ polymer serve
```

## Building Your Application

```
$ polymer build
```

This will create a `build/` folder with `bundled/` and `unbundled/` sub-folders
containing a bundled (Vulcanized) and unbundled builds, both run through HTML,
CSS, and JS optimizers.

You can serve the built versions by giving `polymer serve` a folder to serve
from:

```
$ polymer serve build/bundled
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
