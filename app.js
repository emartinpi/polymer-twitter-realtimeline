
var express = require('express');
var app = express();
var server = app.listen(3000, function () {
  console.log('App listening on port 3000...');
});
var io = require('socket.io')(server);
var cfg = require('./config.json');
var Twit = new require('twit')(cfg);
var hashtag = '', stream;

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

  res.status(200).end();
});
app.use('/twitterstream/track', track);


//untrack a hashtag
var untrack = express.Router();

untrack.post('/:hashtag', function(req, res) {
  handleStopRequest();
  res.status(200).end();
});
app.use('/twitterstream/untrack', untrack);

/************************** API ENDS ************************/


// SocketIO connection & disconect event
var users = 0;

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
