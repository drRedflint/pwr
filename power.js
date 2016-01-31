/* globals require, __dirname, stderr */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sys = require('sys');
var exec = require('child_process').exec;

app.get('/manifest/manifest.json', function (req, res) {
  res.sendFile(__dirname + '/public/manifest/manifest.json');
});
app.get('/styles/*.css', function (req, res) {
  res.sendFile(__dirname + '/public' + req.url);
});
app.get('/scripts/*.js', function (req, res) {
  res.sendFile(__dirname + '/public' + req.url);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/power.html');
});

var units = {
	'1': false,
	'2': false,
	'3': false,
	'4': false
};

io.on('connection', function(socket){
  socket.on('switch', function(msg){
  	var myCmd, reciever;
    var newState = msg.turn_on ? '--on' : '--off';
    var recievers = msg.reciever.split('|');

    function puts(error, stdout) { sys.puts(stdout); }

    for (var i = 0; i < recievers.length; i++) {
      reciever = recievers[i];
  		units[reciever] = msg.turn_on;
  		myCmd = ['tdtool', newState, reciever].join(' ');

      exec(myCmd, puts);
      console.log(myCmd);
  	}

    io.sockets.emit('server_state', units);
  });

  socket.on('client_state', function() {
  	socket.emit('server_state', units);
  });
});

var port = 1339;
http.listen(port, function(){
  console.log('listening on: ' + port);
});