# \<polymerday-twitter-timeline\>

Twitter timeline for polymerday event

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## config.json file

Create a [Twitter App](https://apps.twitter.com/), config it, get the necessary keys and tokens and put then in config.json file

```
{
    "consumer_secret": "your_consumer_secret",
    "consumer_key": "your_consumer_key",
    "token": "your_token",
    "token_secret": "your_secret"
}
```

## Server up and Running

```
$ npm install
$ node app.js
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
