var express = require('express');
var app = express();
var path = require('path');

app.get('/test', function(req, res) {
var varib="kekek";
  res.render('test.ejs', {varib: varib});
	io.emit("pressEmit");
})
.use(express.static(path.join(__dirname, '/public')));

var io = require('socket.io')(app.listen(3345));

io.on('connection', function(socket) {
  console.log('Someone connected');
});


/*app.get("/test", function(req, res) {
	res.send("kekeke");
	io.emit("pressEmit");
	//var battle_id=req.query.id;
	//var battld=777;
	//pressEmit.emit('press',battld);
	}); */






