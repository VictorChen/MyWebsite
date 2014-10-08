var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	draw = require('./routes/draw'),
	http = require('http'),
	stylus = require('stylus'),
	nib = require('nib'),
	path = require('path'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	}else {
		next();
	}
};
app.use(allowCrossDomain);

app.use(app.router);

// Stylus + nib
app.use(stylus.middleware({
	src: __dirname + "/public",
	compile: function (str, path) {
		return stylus(str)
			.set('filename', path)
			.set('compress', true)
			.use(nib())
			.import('nib');
	}
}));

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/draw', draw.game);

server.listen(app.get('port'), process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1', function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// Listen for incoming connections from clients
var userscount = 0;
io.sockets.on('connection', function(socket){
	console.log('new user connected');
	userscount++;
	io.sockets.emit('updateclients', userscount);
	socket.on('mousedown', function(data){
		socket.broadcast.emit('update', data);
	});
	socket.on('mousemove', function(data){
		socket.broadcast.emit('moving', data);
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
		userscount--;
		io.sockets.emit('updateclients', userscount);
		socket.disconnect();
	});
});