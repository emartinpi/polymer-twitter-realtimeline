
var express = require('express');
var app = express();
var server = app.listen(3000, function () {
  console.log('App listening on port 3000...');
});
var io = require('socket.io')(server);
var cfg = require('./config.json');
var tw = require('node-tweet-stream')(cfg);
var hashtag;

/************************* API BEGINS ***********************/

//track a hashtag
var track = express.Router();

track.post('/:hashtag', function(req, res) {
  console.log('Track request: #' + req.params.hashtag);
  tw.track('#' + req.params.hashtag);
  hashtag = req.params.hashtag;
  res.status(200).end();
});
app.use('/twitterstream/track', track);

//untrack a hashtag
var untrack = express.Router();

untrack.post('/:hashtag', function(req, res) {
  console.log('Untrack request: #' + req.params.hashtag);
  tw.untrack('#' + req.params.hashtag);
  hashtag = '';
  res.status(200).end();
});
app.use('/twitterstream/untrack', untrack);

/************************** API ENDS ************************/


//on connection event
var users = 0;

io.on('connection', function (socket) {
  console.log('User connected!! Users: ', ++users);
  socket.on('disconnect', function () {
    console.log('User desconnected!! Users: ', --users);
  });
});

tw.on('connect', function () {
  console.log('Successfully connected to Twitter API');
});

tw.on('disconnect', function () {
  console.log('Disconnected');
});

//on tweet received event
tw.on('tweet', function(tweet){
  io.emit('tweet', {
    hashtag: hashtag,
    tweet: tweet
  });
});

//on error event
tw.on('error', function (err) {
  console.log(err);
});
