var express=require("express");
var server = require('../server');
var router = express.Router();
var mysql = require('mysql');
var bodyParser=require('body-parser');
var url = require('url');



var connection = mysql.createConnection({
        host: 'localhost',//'192.168.2.106',
        user: 'admin',
        password: '123321',
        database: 'cmsedna_test'
});

router.post("/", function(req,res) {
		res.end();
		console.log(req.body);
		var pult_id=parseInt(req.body.pult_id);
		console.log(pult_id);
		var press_time =req.body.press_time;
		var colour = req.body.colour;
		var judge_id;
		var battle_id;
		var ring_id;
		var valid;
		var round;
		var rounds;
		var red_res_round_1=0;
		var red_res_round_2=0;
		var red_res_round_3=0;
		var blue_res_round_1=0;
		var blue_res_round_2=0;
		var blue_res_round_3=0;
		var red_res_total=0;
		var blue_res_total=0;
		let sql_judge_id_press="select judge_id from remote_controls where id="+pult_id+";"
			connection.query(sql_judge_id_press, (err,results)=>{
                if(err) { throw err; }
                var string = JSON.stringify(results);
                var geted_d = JSON.parse(string);
				judge_id=geted_d[0].judge_id;
				console.log(judge_id);
	
		

		let sql_ring_id_press="select ring_id from remote_controls where judge_id="+judge_id+";"
        	connection.query(sql_ring_id_press, (err,results)=>{console.log(judge_id);
            	    if(err) { throw err; }
                	var string = JSON.stringify(results);
                	var geted_d = JSON.parse(string);
					ring_id=geted_d[0].ring_id;
		
		
	
		let sql_battle_id_press="select battle_id, round_status, round_nr from battles_statuses where ring_id="+ring_id+" and battle_status=1;" //Должна быть также проверка на начало боя на этом ринге если бой начат тогда вывести результат если нет то пропустить пакет
        			connection.query(sql_battle_id_press, (err,results)=>{
               			if(err) {throw err;}
						if (results!=""){
                		var string = JSON.stringify(results);
                		var geted_d = JSON.parse(string);
						battle_id=geted_d[0].battle_id;
						valid=geted_d[0].round_status;
						round=geted_d[0].round_nr;
						console.log(judge_id,pult_id,press_time, colour, battle_id, ring_id, valid, round);
				let sql_for_logs='insert into scores_logs (judge_id, battle_id, remote_id, colours_id, time, valid, round) values ('+judge_id+', '+battle_id+', '+pult_id+', '+colour+', \''+press_time+'\', '+valid+', '+round+');'
					//let sql_for_logs='insert into scores_logs (id, judge_id, battle_id, remote_id, colours_id, valid, round) values (16,890,4432,3,1,1,1);'
        			connection.query(sql_for_logs, (err,results)=>{
                	if(err) throw err;      
				let sql_rounds='select age_categories.rounds from battles left join weight_categories on battles.weight_category_id=weight_categories.id left join age_categories on weight_categories.age_category_id=age_categories.id where battles.id='+battle_id+' group by battles.id;'
        		connection.query(sql_rounds, (err,results)=>{
                	if(err) throw err;
                	var string = JSON.stringify(results);
                	var geted_d = JSON.parse(string);
                	rounds=geted_d[0].rounds;
					console.log(rounds);
				
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
						////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				let sql_jscores='select battle_id, round_nr, judge_id, red_score, blue_score from battle_scores where battle_id='+battle_id+' order by round_nr, judge_id;'
		        connection.query(sql_jscores, (err,results)=>{
	                if(err) throw err;
				 	var string = JSON.stringify(results);
	                var scores_data = JSON.parse(string);
					console.log(scores_data);
					if (scores_data==""){
									round_1=[{round_nr: '1', judge_id: '1', red_score: '0', blue_score: '0'},
								 			{round_nr: '1', judge_id: '2', red_score: '0', blue_score: '0'},
											{round_nr: '1', judge_id: '3', red_score: '0', blue_score: '0'}];	
									round_2=[{round_nr: '2', judge_id: '1', red_score: '0', blue_score: '0'},
								 			{round_nr: '2', judge_id: '2', red_score: '0', blue_score: '0'},
											{round_nr: '2', judge_id: '3', red_score: '0', blue_score: '0'}];		
									round_3=[{round_nr: '3', judge_id: '1', red_score: '0', blue_score: '0'},
								 			{round_nr: '3', judge_id: '2', red_score: '0', blue_score: '0'},
											{round_nr: '3', judge_id: '3', red_score: '0', blue_score: '0'}];
								
						
				}else{
					var r=round;
					if(round===0){
					console.log(rounds+"rounds");
					r=rounds;
					}
				let sql_judge_id='select judge_id from battle_scores where battle_id='+battle_id+' and round_nr='+r+' order by round_nr, judge_id;'
        			connection.query(sql_judge_id, (err,results)=>{
               			if(err) throw err;
			 			var string = JSON.stringify(results);
                		var geted_d = JSON.parse(string);
						console.log(results);
						var judge_1=0;
						var judge_2=0;
						var judge_3=0;
						var judge_count=results.length;							
						console.log(judge_count);
												if(judge_count==1){
							judge_1=results[0].judge_id;
							for (var i = 0; i < scores_data.length; i++) {
      				  			if (scores_data[i].round_nr == 1) {
						  			if (judge_1 != 0 ) {
										try{
						  				round_1[0]={round_nr: scores_data[0].round_nr, judge_id: judge_1, red_score: scores_data[0].red_score, blue_score: scores_data[0].blue_score};
											if (round_1[0].red_score>round_1[0].blue_score){
												}
											if (round_1[0].red_score<round_1[0].blue_score){
												}
										}catch (err){
										round_1[0]={round_nr: 1, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									}
								if (scores_data[i].round_nr == 2) {
						  			if (judge_1 != 0 ) {
										try{
						  				round_2[0]={round_nr: scores_data[1].round_nr, judge_id: judge_1, red_score: scores_data[1].red_score, blue_score: scores_data[1].blue_score};
											if (round_2[0].red_score>round_2[0].blue_score){
												}
											if (round_2[0].red_score<round_2[0].blue_score){
												}
										} 
										catch (err){
										round_2[0]={round_nr: 2, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									}
								if (scores_data[i].round_nr == 3) {
						  			if (judge_1 != 0 ) {
										try{
						  				round_3[0]={round_nr: scores_data[2].round_nr, judge_id: judge_1, red_score: scores_data[2].red_score, blue_score: scores_data[2].blue_score};
										} 
										catch (err){
										round_3[0]={round_nr: 3, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									}
								}
											if (round_1[0].red_score>round_1[0].blue_score){
													red_res_round_1=red_res_round_1+1;
												}
											if (round_1[0].red_score<round_1[0].blue_score){
													blue_res_round_1=blue_res_round_1+1;
												}
											if (round_2[0].red_score>round_2[0].blue_score){
													red_res_round_2=red_res_round_2+1;
												}
											if (round_2[0].red_score<round_2[0].blue_score){
													blue_res_round_2=blue_res_round_2+1;
												}
											if (round_3[0].red_score>round_3[0].blue_score){
													red_res_round_3=red_res_round_3+1;
												}
											if (round_3[0].red_score<round_3[0].blue_score){
													blue_res_round_3=blue_res_round_3+1;
												}
							}
						if(judge_count==2){
							judge_1=results[0].judge_id;
							judge_2=results[1].judge_id;
							for (var i = 0; i < scores_data.length; i++) {
      				  			if (scores_data[i].round_nr == 1) {
						  			if (judge_1 != 0 ) {
										try{
						  					round_1[0]={round_nr: scores_data[0].round_nr, judge_id: judge_1, red_score: scores_data[0].red_score, blue_score: scores_data[0].blue_score};
										}
										catch (err){
											round_1[0]={round_nr: 1, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									if (judge_2 != 0 ) {
										try{
											round_1[1]={round_nr: scores_data[1].round_nr, judge_id: judge_2, red_score: scores_data[1].red_score, blue_score: scores_data[1].blue_score};
										}
										catch (err){
											round_1[1]={round_nr: 1, judge_id: judge_2, red_score: 0, blue_score: 0};
										}
									}
									}
								if (scores_data[i].round_nr == 2) {
						  			if (judge_1 != 0 ) {
										try{
						  					round_2[0]={round_nr: scores_data[2].round_nr, judge_id: judge_1, red_score: scores_data[2].red_score, blue_score: scores_data[2].blue_score};
										}
										catch (err){
											round_2[0]={round_nr: 2, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									if (judge_2 != 0 ) {
										try{
											round_2[1]={round_nr: scores_data[3].round_nr, judge_id: judge_2, red_score: scores_data[3].red_score, blue_score: scores_data[3].blue_score};
										}
										catch (err){
											round_2[1]={round_nr: 2, judge_id: judge_2, red_score: 0, blue_score: 0};
										}
									}
									}
								if (scores_data[i].round_nr == 3) {
						  			if (judge_1 != 0 ) {
										try{
						  					round_3[0]={round_nr: scores_data[4].round_nr, judge_id: judge_1, red_score: scores_data[4].red_score, blue_score: scores_data[4].blue_score};
										}
										catch (err){
											round_3[0]={round_nr: 3, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									if (judge_2 != 0 ) {
										try{
											round_3[1]={round_nr: scores_data[5].round_nr, judge_id: judge_2, red_score: scores_data[5].red_score, blue_score: scores_data[5].blue_score};
										}
										catch (err){
											round_3[1]={round_nr: 3, judge_id: judge_2, red_score: 0, blue_score: 0};
										}
									}
									}
								}
											if (round_1[0].red_score>round_1[0].blue_score){
													red_res_round_1=red_res_round_1+1;
												}
											if (round_1[0].red_score<round_1[0].blue_score){
													blue_res_round_1=blue_res_round_1+1;
												}

											if (round_1[1].red_score>round_1[1].blue_score){
													red_res_round_1=red_res_round_1+1;
												}

											if (round_1[1].red_score<round_1[1].blue_score){
													blue_res_round_1=blue_res_round_1+1;
												}	
							
											if (round_2[0].red_score>round_2[0].blue_score){
													red_res_round_2=red_res_round_2+1;
												}
											if (round_2[0].red_score<round_2[0].blue_score){
													blue_res_round_2=blue_res_round_2+1;
												}
											if (round_2[1].red_score>round_2[1].blue_score){
													red_res_round_2=red_res_round_2+1;
												}
											if (round_2[1].red_score<round_2[1].blue_score){
													blue_res_round_2=blue_res_round_2+1;
												}	
											if (round_3[0].red_score>round_3[0].blue_score){
													red_res_round_3=red_res_round_3+1;
												}
											if (round_3[0].red_score<round_3[0].blue_score){
													blue_res_round_3=blue_res_round_3+1;
												}
											if (round_3[1].red_score>round_3[1].blue_score){
													red_res_round_3=red_res_round_3+1;
												}
											if (round_3[1].red_score<round_3[1].blue_score){
													blue_res_round_3=blue_res_round_3+1;
												}
											/*console.log("konechnij");
											console.log(red_res_round_1);
											console.log(blue_res_round_1);
											console.log(red_res_round_2);
											console.log(blue_res_round_2);
											console.log(red_res_round_3);
											console.log(blue_res_round_3);*/
							}
						if(judge_count==3){
							judge_1=results[0].judge_id;
							judge_2=results[1].judge_id;
							judge_3=results[2].judge_id;
							console.log(scores_data[4].round_nr);
							for (var i = 0; i < scores_data.length; i++) {
      				  			if (scores_data[i].round_nr == 1) {
						  			if (judge_1 != 0 ) {
										try{
						  					round_1[0]={round_nr: scores_data[0].round_nr, judge_id: judge_1, red_score: scores_data[0].red_score, blue_score: scores_data[0].blue_score};
										}
										catch (err){
											round_1[0]={round_nr: 1, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									if (judge_2 != 0 ) {
										try{
											round_1[1]={round_nr: scores_data[1].round_nr, judge_id: judge_2, red_score: scores_data[1].red_score, blue_score: scores_data[1].blue_score};
										}
										catch (err){
											round_1[1]={round_nr: 1, judge_id: judge_2, red_score: 0, blue_score: 0};
										}
									}
										
	            					if (judge_3 != 0 ) {
										try{
					  						round_1[2]={round_nr: scores_data[2].round_nr, judge_id: judge_3, red_score: scores_data[2].red_score, blue_score: scores_data[2].blue_score};
										}
										catch (err){
											round_1[2]={round_nr: 1, judge_id: judge_3, red_score: 0, blue_score: 0};							
										}
									}
									}
								if (scores_data[i].round_nr == 2) {
						  			if (judge_1 != 0 ) {
										try{
						  					round_2[0]={round_nr: scores_data[3].round_nr, judge_id: judge_1, red_score: scores_data[3].red_score, blue_score: scores_data[3].blue_score};
										}
										catch (err){
											round_2[0]={round_nr: 2, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									if (judge_2 != 0 ) {
										try{
											round_2[1]={round_nr: scores_data[4].round_nr, judge_id: judge_2, red_score: scores_data[4].red_score, blue_score: scores_data[4].blue_score};
										}
										catch (err){
											round_2[1]={round_nr: 2, judge_id: judge_2, red_score: 0, blue_score: 0};
										}    
									}
									if (judge_3 != 0 ) {
										try{
						  					round_2[2]={round_nr: scores_data[5].round_nr, judge_id: judge_3, red_score: scores_data[5].red_score, blue_score: scores_data[5].blue_score};
										}
										catch (err){
											round_2[2]={round_nr: 2, judge_id: judge_3, red_score: 0, blue_score: 0};
										}
									}
									}
								if (scores_data[i].round_nr == 3) {
						  			if (judge_1 != 0 ) {
										try{
						  					round_3[0]={round_nr: scores_data[6].round_nr, judge_id: judge_1, red_score: scores_data[6].red_score, blue_score: scores_data[6].blue_score};
										}
										catch (err){
											round_3[0]={round_nr: 3, judge_id: judge_1, red_score: 0, blue_score: 0};
										}
									}
									if (judge_2 != 0 ) {
										try{
											round_3[1]={round_nr: scores_data[7].round_nr, judge_id: judge_2, red_score: scores_data[7].red_score, blue_score: scores_data[7].blue_score};
										}
										catch (err){
											round_3[1]={round_nr: 3, judge_id: judge_2, red_score: 0, blue_score: 0};
										}   
									}
									if (judge_3 != 0 ) {
										try{
						  					round_3[2]={round_nr: scores_data[8].round_nr, judge_id: judge_3, red_score: scores_data[8].red_score, blue_score: scores_data[8].blue_score};	
										}
										catch (err){
											round_3[2]={round_nr: 3, judge_id: judge_3, red_score: 0, blue_score: 0};
										}
									}
									}
								}
											if (round_1[0].red_score>round_1[0].blue_score){
													red_res_round_1=red_res_round_1+1;
												}
											if (round_1[0].red_score<round_1[0].blue_score){
													blue_res_round_1=blue_res_round_1+1;
												}

											if (round_1[1].red_score>round_1[1].blue_score){
													red_res_round_1=red_res_round_1+1;
												}

											if (round_1[1].red_score<round_1[1].blue_score){
													blue_res_round_1=blue_res_round_1+1;
												}	
											if (round_1[2].red_score>round_1[2].blue_score){
													red_res_round_1=red_res_round_1+1;
												}

											if (round_1[2].red_score<round_1[2].blue_score){
													blue_res_round_1=blue_res_round_1+1;
												}	
							
											if (round_2[0].red_score>round_2[0].blue_score){
													red_res_round_2=red_res_round_2+1;
												}
											if (round_2[0].red_score<round_2[0].blue_score){
													blue_res_round_2=blue_res_round_2+1;
												}
											if (round_2[1].red_score>round_2[1].blue_score){
													red_res_round_2=red_res_round_2+1;
												}
											if (round_2[1].red_score<round_2[1].blue_score){
													blue_res_round_2=blue_res_round_2+1;
												}	
											if (round_2[2].red_score>round_2[2].blue_score){
													red_res_round_2=red_res_round_2+1;
												}
											if (round_2[2].red_score<round_2[2].blue_score){
													blue_res_round_2=blue_res_round_2+1;
												}	
											if (round_3[0].red_score>round_3[0].blue_score){
													red_res_round_3=red_res_round_3+1;
												}
											if (round_3[0].red_score<round_3[0].blue_score){
													blue_res_round_3=blue_res_round_3+1;
												}
											if (round_3[1].red_score>round_3[1].blue_score){
													red_res_round_3=red_res_round_3+1;
												}
											if (round_3[1].red_score<round_3[1].blue_score){
													blue_res_round_3=blue_res_round_3+1;
												}
											if (round_3[2].red_score>round_3[2].blue_score){
													red_res_round_3=red_res_round_3+1;
												}
											if (round_3[2].red_score<round_3[2].blue_score){
													blue_res_round_3=blue_res_round_3+1;
												}
							}							//в дальнейшем нужно убрать id judge
								console.log(round_1);
								console.log(round_2);
								console.log(round_3);
							console.log("Connected clients: "+server.connected_clients[0]);
							red_res_total=Number(red_res_round_1)+Number(red_res_round_2)+Number(red_res_round_3);
							blue_res_total=Number(blue_res_round_1)+Number(blue_res_round_2)+Number(blue_res_round_3);
							//io.emit('pressEmit',round_1, round_2, round_3);
							for (var i = 0; i < server.connected_clients.length; i++) {
       							if (server.connected_clients[i].battle_id == battle_id) {
									console.log(server.connected_clients[i].client_id);
									var io=req.io;
									//var data=[round_1, round_2, round_3, red_res_round_1, red_res_round_2, red_res_round_3, blue_res_round_1, blue_res_round_2, blue_res_round_3, red_res_total, blue_res_total];
									//io.to(connected_clients[i].client_id).emit('pressEmit', round_1, round_2, round_3);
									io.to(server.connected_clients[i].client_id).emit('pressEmit', round_1, round_2, round_3, red_res_round_1, red_res_round_2, red_res_round_3, blue_res_round_1, blue_res_round_2, blue_res_round_3, red_res_total, blue_res_total);
        						}
    						}	
							
							});
						}
						});
					});
				});
						}
			});
		});
	});
	
	
		
	console.log('Hi I get this data: TIME - ' + press_time + ' ' + 'Pult ID - ' + pult_id +' '+'Colour - '+colour);
	console.log("Connected clients: "+server.connected_clients);
}); 

module.exports=router;