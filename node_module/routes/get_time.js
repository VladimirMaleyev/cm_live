var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function(request, response) {
		console.log('Time synchronization... ');
		var send_time=String(moment().unix());
		response.send(send_time);
		//response.end("what");

});

module.exports = router;