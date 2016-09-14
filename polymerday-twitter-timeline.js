(function(){
  Polymer({
    is: 'polymerday-twitter-timeline',
    properties: {

      /**
       * hashtag **Required**
       */
      hashtag: {
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
       *
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
      }
    },

    /**
     * Polymer ready event
     */
    ready: function() {
      twttr.ready(function() {
        var n = 0;
        var twSocket = io.connect('http://localhost:3000');

        // twSocket.on('connect', function () {console.log('Connection success');});
        // twSocket.on('connect_error', function () {console.log('Connection failed!');});
        // twSocket.on('connect_timeout', function () {console.log('Connection timeout!');});
        // twSocket.on('reconnect_attempt', function () {console.log('Reconnection attemp!');});
        // twSocket.on('reconnect', function () {console.log('Reconnection success!');});
        // twSocket.on('reconnect_failed', function () {console.log('Reconnection failed!');});
        twSocket.on('tweet', function (tweet) {
          tweet.n = ++n;
          this._tweetHandle(tweet);
        }.bind(this));
      }.bind(this));
    },

    /**
     * handle the tweet
     */
    _tweetHandle: function(tweet) {
      if (tweet.n % 5 === 0) {
        this.async(function() {
          twttr.widgets.createTweet(
            tweet.id_str,
            Polymer.dom(this.$.timeline).insertBefore(document.createElement('div'),
            this.$.timeline.firstChild),
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
      }
    },


    /**
     * @return {String} Returns *hidden* if expand is false.
     */
    _isExpanded: function(expand) {
      return expand ? '': 'hidden';
    }
  });
}());
