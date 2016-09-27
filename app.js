
var express = require('express');
var app = express();
var cfg = require('./config.json');

app.set('port', (process.env.PORT || 3000));
app.set('consumer_key', (process.env.consumer_key || cfg.consumer_key));
app.set('consumer_secret', (process.env.consumer_secret || cfg.consumer_secret));
app.set('access_token', (process.env.access_token || cfg.access_token));
app.set('access_token_secret', (process.env.access_token_secret || cfg.access_token_secret));

var server = app.listen(app.get('port'), function () {
  console.log('App listening on port ' + app.get('port'));
});
var io = require('socket.io')(server);

var Twit = new require('twit')({
  consumer_key: app.get('consumer_key'),
  consumer_secret: app.get('consumer_secret'),
  access_token: app.get('access_token'),
  access_token_secret: app.get('access_token_secret')
});
var hashtag = '', stream, users;

/************************* API BEGINS ***********************/

//track a hashtag
var track = express.Router();

track.post('/:hashtag', function(req, res) {

  // stop tracking a hashtag if any
  if (hashtag !== '') {
    handleStopRequest();
  }

  hashtag = req.params.hashtag;
  handleStreamRequest();

  res
    .set('Access-Control-Allow-Origin', '*')
    .status(200)
    .end();
});
app.use('/twitterstream/track', track);


//untrack a hashtag
var untrack = express.Router();

untrack.post('/:hashtag', function(req, res) {
  handleStopRequest();
  res
    .set('Access-Control-Allow-Origin', '*')
    .status(200)
    .end();
});
app.use('/twitterstream/untrack', untrack);

/************************** API ENDS ************************/


// SocketIO connection & disconect event
users = 0;

io.on('connection', function (socket) {
  console.log('User connected!! Users: ', ++users);
  socket.on('disconnect', function () {
    console.log('User desconnected!! Users: ', --users);
  });
});


/**
 * handle the track of a hashtag
 */
function handleStreamRequest() {
  console.log('Track request: #' + hashtag);
  stream = Twit.stream('statuses/filter', { track: '#' + hashtag });

  // connect event
  stream.on('connect', function () {
    console.log('Successfully connected to Twitter API for: #' + hashtag);
  });

  // disconnect event
  stream.on('disconnect', function () {
    console.log('Disconnected');
  });

  // error event
  stream.on('error', function (err) {
    console.log(err);
  });

  // tweet event
  stream.on('tweet', function (tweet) {

    // send event to the client throught SocketIO
    io.emit('tweet', {
      hashtag: hashtag,
      tweet: tweet
    });
  });
}

function handleStopRequest() {
  console.log('Untrack request: #' + hashtag);
  stream.stop();
  hashtag = '';
}
