(function() {
  Polymer({
    is: 'my-demo',
    properties: {
      apiUrlBase: {
        type: String,
        value: 'http://localhost:3000'
      },
      user: {
        type: Object,
        value: null,
        observer: '_computeUserData'
      },

      _hashtag: {
        type: String,
        observer: '_hashtagObserver'
      },

      _trackUrl: {
        type: String,
        readOnly: true
      }
    },

    ready: function() {
      this.signInAnonymously();
    },

    signInAnonymously: function() {
      this.$.auth
        .signInAnonymously()
          .then(function() {
            //ok
          }.bind(this))
          .catch(function() {
            console.log('Error connecting to database');
          }.bind(this));
    },

    _computeUserData: function(user) {
      if (user) {
        this.set('_hashtagPath', '/hashtag/to/track');
      }
    },

    _hashtagObserver: function(_hashtag) {
      if (typeof _hashtag !== 'string') {
        return;
      }

      _hashtag = _hashtag.replace(/#/, '');
      this.$.input.value = _hashtag;

      //this line will force a new api call
      this._set_trackUrl(this.apiUrlBase + '/twitterstream/track/' + _hashtag);
    },

    _doRequest: function() {
      if (this.$.form.validate()) {
        this.set('_hashtag', this.$.input.value);
      }
    }
  });
}());
