(function(){
  Polymer({
    is: 'polymerday-twitter-timeline',
    properties: {

      /**
       * host:port where your api server code is (no twitter api)
       */
      apiUrlBase: {
        type: String,
        value: 'http://localhost:3000/twittertrack'
      },

      /**
       * hashtag **Required**
       */
      hashtag: {
        type: String,
        observer: '_hashtagObserver'
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
       * Minimum period of time it has to be spent to show new tweet
       */
      timeSlot: {
        type: Number,
        value: function() {
          return 10;
        }
      },

      /**
       ************************************
       ******** Private Properties ********
       */

      /**
       * api url to track a hashtag
       * this.apiUrlBase + /track/ + <hashtag>
       */
      _trackUrl: {
        type: String,
        readOnly: true
      },

      /**
       * api url to untrack a hashtag
       * this.apiUrlBase + /untrack/ + <hashtag>
       */
      _untrackUrl: {
        readOnly: true,
        type: String
      },

      /**
       * Dynamically created function called to untrack the previos hashtag
       */
      _untrackFn: {
        readOnly: true,
        type: Function
      },

      /**
       * computed property
       */
      _cards: {
        type: String,
        computed: '_isExpanded(expand)'
      },

      /**
       * arrTweets
       */
      _arrTweets: {
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
        var twSocket = io.connect(this.apiUrl);

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
     * Hashtag property observer.
     * Untrack previos hashtag if any, track new hashtag and set new dinamically function tu untrack the new hashtag
     * @param {String} hashtag
     */
    _hashtagObserver: function(hashtag) {
      hashtag = hashtag.replace(/#/, '');

      //untrack previous hashtag if any
      if (typeof this._untrack === 'function') {
        this._untrack();
      }

      //this line will force a new api call
      this._set_trackUrl(this.apiUrl + '/track/' + hashtag);

      //set new untrack() function to call to untrack the previous hashtag
      this._set_untrackFn(function() {
        this._set_untrackUrl(this.apiUrl + '/untrack/' + hashtag);
      });
    }
  });
}());
