(function(){
  Polymer({
    is: 'polymer-twitter-realtimeline',
    properties: {

      /**
       * host:port where your api server code is (no twitter api)
       */
      apiUrlBase: {
        type: String
      },

      /**
       * Float the Tweet *left*, *right*, or *center* relative to its container.
       */
      align: {
        type: String
      },

      /**
       * If *false*, links in a Tweet are not expanded to photo, video, or link previews.
       */
      expand: {
        type: Boolean,
        value: false
      },

      /**
       * When set to *none*, only the cited Tweet will be displayed even if it is in reply to another Tweet.
       */
      conversation: {
        type: String
      },

      /**
       * Loads text components in the specified language. [Twitter language code](https://dev.twitter.com/overview/general/adding-international-support-to-your-apps).
       * **Note**: does not affect the text of the cited Tweet.
       */
      language: {
        type: String,
        value: 'es'
      },

      /**
       * When set to *dark*, displays Tweet with light text over a darkbackground.
       */
      theme: {
        type: String,
        value: 'light'
      },

      /**
       * The maximum width of the rendered Tweet in whole pixels. This valueshould be between 250 and 550 pixels.
       */
      width: {
        type: Number
      },

      /**
       * Minimum period of time (ms) that has to be spent to show a new tweet. By default every tweet is shown as soon as possible
       */
      elapse: {
        type: Number,
        value: 0
      },

      /**
       ************************************
       ******** Private Properties ********
       */

      /**
       * computed property
       */
      _cards: {
        type: String,
        computed: '_isExpanded(expand)'
      }
    },

    /**
     * Polymer ready event
     */
    ready: function() {
      twttr.ready(function() {

        if (!this.apiUrlBase) {
          this._log(this._logf('apiUrlBase', 'apiUrlBase must not be undefined'));
          return;
        }

        var twSocket = io.connect(this.apiUrlBase);
        var _tweetHandler = this._createTweetHandler();

        // twSocket.on('connect', function () {console.log('Connection success');});
        // twSocket.on('connect_error', function () {console.log('Connection failed!');});
        // twSocket.on('connect_timeout', function () {console.log('Connection timeout!');});
        // twSocket.on('reconnect_attempt', function () {console.log('Reconnection attemp!');});
        // twSocket.on('reconnect', function () {console.log('Reconnection success!');});
        // twSocket.on('reconnect_failed', function () {console.log('Reconnection failed!');});
        twSocket.on('tweet', function (data) {
          _tweetHandler(data);
        }.bind(this));
      }.bind(this));
    },


    /**
     * Tweet handler.
     * @returns {Function} Function that process the tweet and when it must be drawn depending on elapse property
     */
    _createTweetHandler: function() {
      var currentTweet, mustBeDrawn, arrTimeoutId, hashtag;

      currentTweet = 0;
      mustBeDrawn = 0;
      arrTimeoutId = [];

      return this.elapse === 0 ? (function(data) {

        //this function will be run as at microtask timing
        this.async(function() {
          this._drawTweet(data.tweet);
        });
      }.bind(this)) : (function(data) {

        var diff, time, timeoutId;

        //check if necessary to cancel async functions and reninitialize values due to a new hashtag track
        if (data.hashtag !== hashtag) {
          arrTimeoutId.forEach(function(timeoutId) {
            this.cancelAsync(timeoutId);
          }, this);
          hashtag = data.hashtag;
          arrTimeoutId = [];
          mustBeDrawn = 0;
        }

        currentTweet = performance.now();
        diff = currentTweet - mustBeDrawn;
        time = diff < 0 ? Math.abs(diff) : 0;
        mustBeDrawn = (diff < 0 ? mustBeDrawn : currentTweet) + this.elapse;

        //this function will be run with a calculated delay
        timeoutId = this.async(function() {
          this._drawTweet(data.tweet);
        }, time);
        arrTimeoutId.push(timeoutId);

      }.bind(this));
    },

    /**
     * @return {String} Returns *hidden* if expand is false.
     */
    _isExpanded: function(expand) {
      return expand ? '': 'hidden';
    },

    /**
     * Calls Twitter for Websits widgets to get the look and feel of a tweet
     * @param {Object} tweet object from Twitter stream API
     */
    _drawTweet: function(tweet) {
      twttr.widgets.createTweet(
        tweet.id_str,
        this.$.timeline,
        {
          align: this.align,
          cards: this._cards,
          conversation: this.conversation,
          lang: this.language,
          theme: this.theme,
          width: this.width
        }
      );
    }
  });
}());
