var express=require("express");
var app = express();
var get_time=require('./routes/get_time');
var battle_data=require('./routes/battle_data');
var start_timer=require('./routes/start_timer');
var hits=require('./routes/hits');
var show=require('./routes/show');
var mysql = require('mysql');
var url = require('url');
var bodyParser=require('body-parser');
//var events = require('events');
var io = require('socket.io')(app.listen(3345));
//var ejs = require('ejs');


var connection = mysql.createConnection({
        host: 'localhost',//'192.168.2.106',
        user: 'admin',
        password: '123321',
        database: 'cmsedna_test'
});

connection.connect((err) => {
        if(err){
                connect_to_base.release();
                return console.log(err);
        }
        console.log("Mysql Connected");
});

var connected_clients=[];


app.use('/public',express.static('public'));        
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    req.io = io;
    next();
});

app.use('/get_time', get_time);
app.use('/battle_data?', battle_data);
app.use('/start_timer', start_timer);
app.use('/hits', hits);
app.use('/show?', show);



io.on('connection', function(socket) {
	console.log("Connect "+socket.id);
	var cl_id=socket.id;
	socket.emit('connection');
		socket.on('send_btl_id', function(bt_id){
			console.log(bt_id+" "+cl_id);
				var client_id=connected_clients.length;
				connected_clients[client_id]={battle_id: bt_id, client_id: cl_id};
			console.log(connected_clients);
		});
	socket.on('disconnect', function() {
			console.log("disonnected "+socket.id);
				for (var i = 0; i < connected_clients.length; i++) {
       				if (connected_clients[i].client_id == socket.id) {
							connected_clients.splice(i, 1);
        				}
    				}
	});
});


//test
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/test", function(req, res) {
	res.send("kek");
	var be_id=4429;
		var round_1;
		var round_2;
		var round_3;
				round_1=[{round_nr: '1', judge_id: '1', red_score: '0', blue_score: '0'},
						{round_nr: '1', judge_id: '2', red_score: '0', blue_score: '0'},
						{round_nr: '1', judge_id: '3', red_score: '0', blue_score: '0'}];	
				round_2=[{round_nr: '2', judge_id: '1', red_score: '0', blue_score: '0'},
			 			{round_nr: '2', judge_id: '2', red_score: '0', blue_score: '0'},
						{round_nr: '2', judge_id: '3', red_score: '0', blue_score: '0'}];		
				round_3=[{round_nr: '3', judge_id: '1', red_score: '0', blue_score: '0'},
			 			{round_nr: '3', judge_id: '2', red_score: '0', blue_score: '0'},
						{round_nr: '3', judge_id: '3', red_score: '0', blue_score: '0'}];
	
					for (var i = 0; i < connected_clients.length; i++) {
       					if (connected_clients[i].battle_id == be_id) {
							console.log(connected_clients[i].client_id);
							io.to(connected_clients[i].client_id).emit('pressEmit', round_1, round_2, round_3);
        				}
    				}
	}); 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/show", function(req, res) {
	res.render('show.ejs',{err_nr:err_nr});
});




/*router.listen('3345', () => {
        console.log('Server started on port 3345')
});*/

module.exports.connected_clients=connected_clients;
