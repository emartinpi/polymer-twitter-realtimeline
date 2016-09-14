
var express = require('express');
var app = express();
var server = app.listen(3000, function () {
  console.log('App listening on port 3000...');
});
var io = require('socket.io')(server);
var cfg = require('./config.json');
var tw = require('node-tweet-stream')(cfg);


// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });

var track = express.Router();

track.post('/:hashtag', function(req, res) {
  console.log('Peticion track!', req.params.hashtag);
  res.status(200).end();
});
app.use('/track', track);

var untrack = express.Router();

track.post('/:hashtag', function(req, res) {
  console.log('Peticion untrack!', req.params.hashtag);
  res.status(200).end();
});
app.use('/untrack', untrack);

/**
 * on connection event
 */
var users = 0;

io.on('connection', function (socket) {
  console.log('User connected!! Users: ', ++users);
  socket.on('disconnect', function () {
    console.log('User desconnected!! Users: ', --users);
  });
});

/**
 * track javascript word
 */
tw.track('#love');
tw.on('tweet', function(tweet){
  io.emit('tweet', tweet);
});
