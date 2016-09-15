(function(){
  Polymer({
    is: 'polymerday-twitter-timeline',
    properties: {

      /**
       * host:port where your api server code is (no twitter api)
       */
      apiUrlBase: {
        type: String,
        value: 'http://localhost:3000'
      },

      /**
       * hashtag **Required**
       */
      hashtag: {
        type: String,
        observer: 'hashtagObserver'
      },

      /**
       * @private
       */
      trackUrl: {
        type: String,
        readOnly: true
      },

      /**
       * @private
       */
      untrackUrl: {
        readOnly: true,
        type: String
      },

      /**
       * @private
       */
      untrack: {
        readOnly: true,
        type: Function
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
       * computed property
       */
      _cards: {
        type: String,
        computed: '_isExpanded(expand)'
      },

      /**
       * When set to *none*, only the cited Tweet will be displayed even if it is
       * in reply to another Tweet.
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
       * When set to *dark*, displays Tweet with light text over a dark
       * background.
       */
      theme: {
        type: String,
        value: 'light'
      },

      /**
       * The maximum width of the rendered Tweet in whole pixels. This value
       * should be between 250 and 550 pixels.
       */
      width: {
        type: Number
      },

      /**
       * time slot
       */
      timeSlot: {
        type: Number,
        value: function() {
          return 10;
        }
      },

      /**
       * arrTweets
       */
      arrTweets: {
        type: Array,
        value: function() {
          return [];
        }
      }
    },

    /**
     * Polymer ready event
     */
    ready: function() {
      twttr.ready(function() {
        var twSocket = io.connect(this.apiUrlBase);

        // twSocket.on('connect', function () {console.log('Connection success');});
        // twSocket.on('connect_error', function () {console.log('Connection failed!');});
        // twSocket.on('connect_timeout', function () {console.log('Connection timeout!');});
        // twSocket.on('reconnect_attempt', function () {console.log('Reconnection attemp!');});
        // twSocket.on('reconnect', function () {console.log('Reconnection success!');});
        // twSocket.on('reconnect_failed', function () {console.log('Reconnection failed!');});
        twSocket.on('tweet', function (tweet) {
          this._tweetHandle(tweet);
        }.bind(this));
      }.bind(this));
    },

    /**
     * Tweet handler
     * @param {Object} tweet from Twitter stream api
     */
    _tweetHandle: function(tweet) {
      this.async(function() {
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
      });
    },

    /**
     * @return {String} Returns *hidden* if expand is false.
     */
    _isExpanded: function(expand) {
      return expand ? '': 'hidden';
    },

    /**
     *
     *
     * @param {any} hashtag
     */
    hashtagObserver: function(hashtag) {
      hashtag = hashtag.replace(/#/, '');

      //untrack previous hashtag if any
      if (typeof this.untrack === 'function') {
        this.untrack();
      }

      //this line will force a new api call
      this._setTrackUrl(this.apiUrlBase + '/twitterapi/track/' + hashtag);

      //set new untrack function
      this._setUntrack(function() {
        this._setUntrackUrl(this.apiUrlBase + '/twitterapi/untrack/' + hashtag);
      });
    }
  });
}());
