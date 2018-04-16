var express=require("express");
var router = express.Router();
var server = require('../server');
var mysql = require('mysql');
var bodyParser=require('body-parser');
var url = require('url');

var connection = mysql.createConnection({
        host: 'localhost',//'192.168.2.106',
        user: 'admin',
        password: '123321',
        database: 'cmsedna_test'
});

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', function (req, res) {
	//console.log(req.body);//client send when round begin
	var battle_id=req.body.battle_id;
	var round=req.body.round_n;
	var ring_id;
	var battle_status=req.body.battle_status;
	var round_status=req.body.round_status;
	let sql_check_battle_statuses='select battle_status, round_status from battles_statuses where battle_id='+battle_id+';'
	 connection.query(sql_check_battle_statuses, (err,results)=>{
        	if(err) throw err;
            var string = JSON.stringify(results);
            var geted_d = JSON.parse(string);
		 	console.log("nachalo boja "+battle_id);
		 	console.log(results);
		 	if (results!=""){
				var b_status=geted_d[0].battle_status;
		 		var r_status=geted_d[0].round_status;
		 		
		 		if (b_status==0 || r_status==0){
					var date_now=new Date();
					var Month=date_now.getMonth()+1;
					var st_time=date_now.getFullYear()+"-"+Month+"-"+date_now.getDate()+" "+date_now.getHours()+":"+date_now.getMinutes()+":"+date_now.getSeconds();
					console.log("Eto vremja: "+st_time);
					
					
					let sql_ring_id='select ring_id from battles where id='+battle_id+';'
        				connection.query(sql_ring_id, (err,results)=>{
        					if(err) throw err;
            				var string = JSON.stringify(results);
				            var geted_d = JSON.parse(string);
							ring_id=geted_d[0].ring_id;
								let sql_press_update='update battles_statuses set battle_status='+battle_status+', round_nr='+round+', round_status='+round_status+', ring_id='+ring_id+', start_time=\''+st_time+'\' where battle_id='+battle_id+';'
						        	connection.query(sql_press_update, (err,results)=>{
						                if(err)throw err;
									});
						});							
				}
				if (b_status==1 || r_status==1){
					
					let sql_ring_id='select ring_id from battles where id='+battle_id+';'
        				connection.query(sql_ring_id, (err,results)=>{
        					if(err) throw err;
            				var string = JSON.stringify(results);
				            var geted_d = JSON.parse(string);
							ring_id=geted_d[0].ring_id;
							
								console.log("battle_status="+battle_status+" round_status="+round_status);
								if (round_status=="false" || battle_status==="false"){
									let sql_press_update_status_time='update battles_statuses set battle_status='+battle_status+', round_nr='+round+', round_status='+round_status+', ring_id='+ring_id+', start_time=null where battle_id='+battle_id+';'
						        	connection.query(sql_press_update_status_time, (err,results)=>{
						                if(err)throw err;
									});
									var time=0;
								for (var i = 0; i < server.connected_clients.length; i++) {
       							if (server.connected_clients[i].battle_id == battle_id) {
									console.log(server.connected_clients[i].client_id);
									var io=req.io;
									//var data=[round_1, round_2, round_3, red_res_round_1, red_res_round_2, red_res_round_3, blue_res_round_1, blue_res_round_2, blue_res_round_3, red_res_total, blue_res_total];
									//io.to(connected_clients[i].client_id).emit('pressEmit', round_1, round_2, round_3);
									io.to(server.connected_clients[i].client_id).emit('timeNull', time);
        						}
    						}	
								}
								if (round_status==="true" || battle_status==="true"){	
								let sql_press_update_status='update battles_statuses set battle_status='+battle_status+', round_nr='+round+', round_status='+round_status+', ring_id='+ring_id+' where battle_id='+battle_id+';'
						        	connection.query(sql_press_update_status, (err,results)=>{
						                if(err)throw err;
									});
								}
						});			
				
				}
				if (r_status==null && b_status==null){
					let sql_ring_id='select ring_id from battles where id='+battle_id+';'
        						connection.query(sql_ring_id, (err,results)=>{
        							if(err) throw err;
		            				var string = JSON.stringify(results);
						            var geted_d = JSON.parse(string);
									ring_id=geted_d[0].ring_id;
									console.log("Nomer ringa: "+ring_id);
									
							var battle_status=req.body.battle_status;
							var round_status=req.body.round_status;
							var date_now=new Date();
							var Month=date_now.getMonth()+1;
							var st_time=date_now.getFullYear()+"-"+Month+"-"+date_now.getDate()+" "+date_now.getHours()+":"+date_now.getMinutes()+":"+date_now.getSeconds();
							console.log("Eto vremja: "+st_time);
				
							let sql_press_insert='update battles_statuses set battle_status='+battle_status+', round_nr='+round+', round_status='+round_status+', ring_id='+ring_id+', start_time=\''+st_time+'\' where battle_id='+battle_id+';'
        						connection.query(sql_press_insert, (err,results)=>{
                					if(err) throw err;
									});
									
								});	
				}
			}
		 	
		 
		 	if (results==""){
				
							let sql_ring_id='select ring_id from battles where id='+battle_id+';'
        						connection.query(sql_ring_id, (err,results)=>{
        							if(err) throw err;
		            				var string = JSON.stringify(results);
						            var geted_d = JSON.parse(string);
									ring_id=geted_d[0].ring_id;
									console.log("Nomer ringa: "+ring_id);
									
							var battle_status=req.body.battle_status;
							var round_status=req.body.round_status;
							var date_now=new Date();
							var Month=date_now.getMonth()+1;
							var st_time=date_now.getFullYear()+"-"+Month+"-"+date_now.getDate()+" "+date_now.getHours()+":"+date_now.getMinutes()+":"+date_now.getSeconds();
							console.log("Eto vremja: "+st_time);
				
							let sql_press_insert='insert into battles_statuses (battle_id, battle_status, round_nr, round_status, ring_id, start_time) values ('+battle_id+','+battle_status+','+round+','+round_status+','+ring_id+',\''+st_time+'\');'
        						connection.query(sql_press_insert, (err,results)=>{
                					if(err) throw err;
									});
									
								});	
							}
	 		});
		
	});

module.exports=router;