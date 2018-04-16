//var express=require("express");
//var app = express();
//var bodyParser=require('body-parser');
//var get_time=require('./routes/get_time');

 
//app.use(bodyParser.urlencoded({ extended: true }));

//app.use('/get_time', require('./routes/get_time'));
/*router.get("/get_time", function(request, response) {
	console.log('Time synchronization... ');
	var moment = require('moment');
	var send_time=String(moment().unix());
	response.send(send_time);
	response.end();
	}); 
*/
/*router.post("/hits", function(req,res) {
		console.log(req.body);
		var pult_id=parseInt(req.body.pult_id);
		var press_time =req.body.press_time;
		var colour = req.body.colour;
		console.log('Hi I get this data: TIME - ' + press_time + ' ' + 'Pult ID - ' + pult_id +' '+'Colour - '+colour);
		res.end();		
}); 
	 	
*/
//app.listen('3345', () => {
 //       console.log('Server started on port 3000')
//});

let express = require('express');
let app = express();

// NOTE: We call `app.use()` here, NOT `app.get()`
//app.use('/get_time', require('./routes/get_time'));
var date_now=new Date();
console.log(date_now);

app.listen(3345);