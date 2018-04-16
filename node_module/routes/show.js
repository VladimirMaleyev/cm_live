var express=require("express");
var router = express.Router();
var mysql = require('mysql');
var bodyParser=require('body-parser');

router.use('/public',express.static('public'));        
router.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
        host: 'localhost',//'192.168.2.106',
        user: 'admin',
        password: '123321',
        database: 'cmsedna_test'
});


router.get('/', function(req, res) {
	let valid_battle_id='select id from battles where id='+req.query.id+';'
        connection.query(valid_battle_id, (err,results)=>{
		if(err) throw err;
			if (results==""){
				err_nr=404;
				res.render('error.ejs',{err_nr:err_nr});
			}else{
			var data;
			var round_nr=1;
			var weight;
			var rounds;
			var ring_nr;
			var battlenr;
			var red_name;
			var red_surname;
			var blue_name;
			var blue_surname;
			var red_club;
			var blue_club;
			var round_1;
			var round_2;
			var round_3;
			var rounds_time=0;
			var st_time=0;
			var s_time=0;
			round_1=[{round_nr: '1', judge_id: '1', red_score: '0', blue_score: '0'},
						{round_nr: '1', judge_id: '2', red_score: '0', blue_score: '0'},
						{round_nr: '1', judge_id: '3', red_score: '0', blue_score: '0'}];	
				round_2=[{round_nr: '2', judge_id: '1', red_score: '0', blue_score: '0'},
			 			{round_nr: '2', judge_id: '2', red_score: '0', blue_score: '0'},
						{round_nr: '2', judge_id: '3', red_score: '0', blue_score: '0'}];		
				round_3=[{round_nr: '3', judge_id: '1', red_score: '0', blue_score: '0'},
			 			{round_nr: '3', judge_id: '2', red_score: '0', blue_score: '0'},
						{round_nr: '3', judge_id: '3', red_score: '0', blue_score: '0'}];
			let sql_weight='select weight_categories.max from battles inner join weight_categories on battles.weight_category_id = weight_categories.id where battles.id='+req.query.id+';'
        		connection.query(sql_weight, (err,results)=>{
	                if(err) throw err;
	                var string = JSON.stringify(results);
	                var geted_d = JSON.parse(string);
	                weight=geted_d[0].max;
	                console.log(weight);			
                });

			let sql_round_nr='select round_nr from battles_statuses where battle_id='+req.query.id+';'
       			connection.query(sql_round_nr, (err,results)=>{
					try{
						var string = JSON.stringify(results);
	                	var geted_d = JSON.parse(string);	
						console.log(results);
						round_nr=geted_d[0].round_nr;
					}catch(err){
						let sql_round_insert='insert into battles_statuses (battle_id, round_nr) values ('+req.query.id+',1);'
	        				connection.query(sql_round_insert, (err,results)=>{
		                		if(err) throw err;
								
							let sql_round_nr_r='select round_nr from battles_statuses where battle_id='+req.query.id+';'
	       						connection.query(sql_round_nr_r, (err,results)=>{
	               			 		if(err) throw err;
									var string = JSON.stringify(results);
	                				var geted_d = JSON.parse(string);	
									round_nr=geted_d[0].round_nr;
								});
							});
						}
				});
	
	
			let sql_rounds='select age_categories.rounds from battles left join weight_categories on battles.weight_category_id=weight_categories.id left join age_categories on weight_categories.age_category_id=age_categories.id where battles.id='+req.query.id+' group by battles.id;'
        		connection.query(sql_rounds, (err,results)=>{
                	if(err) throw err;
                	var string = JSON.stringify(results);
                	var geted_d = JSON.parse(string);
                	rounds=geted_d[0].rounds;
					console.log(rounds);
				});
			let sql_rounds_time='select age_categories.time from battles left join weight_categories on battles.weight_category_id=weight_categories.id left join age_categories on weight_categories.age_category_id=age_categories.id where battles.id='+req.query.id+' group by battles.id;'
        		connection.query(sql_rounds_time, (err,results)=>{
                	if(err) throw err;
                	var string = JSON.stringify(results);
                	var geted_d = JSON.parse(string);
                	var minutes=geted_d[0].time;
					rounds_time=Number(minutes)*60;
					console.log(rounds_time);
				});
    		let sql_ringnr='select rings.nr from battles inner join rings on battles.ring_id = rings.id where battles.id='+req.query.id+';'
        		connection.query(sql_ringnr, (err,results)=>{
	                if(err) throw err;
	                var string = JSON.stringify(results);
	                var geted_d = JSON.parse(string);
	                ring_nr=geted_d[0].nr;
					console.log(ring_nr);
				});
		let sql_start_time='select start_time from battles_statuses where battle_id='+req.query.id+';'
        		connection.query(sql_start_time, (err,results)=>{
	                if(err) throw err;
	                var string = JSON.stringify(results);
	                var geted_d = JSON.parse(string);
	         		if (results!=""){
	                s_time=geted_d[0].start_time;
					//#if(s_time==null){st_time=0;}
					//if(s_time!=null){
					//var date_now=new Date();
					//date_start=new Date(s_time);
					//st_time=((date_now-date_start)/1000).toFixed();
					//console.log(date_now+"-"+date_start+"="+st_time);	
						
					/*var conF_time="01-01-1970 "+s_time;
					var s_date= new Date(conF_time);
					var date_now=new Date();
					var n_time=date_now.getHours()+":"+date_now.getMinutes()+":"+date_now.getSeconds();
					var conS_time="01-01-1970 "+n_time;
					var n_date= new Date(conS_time);
					st_time=(n_date-s_date)/1000;*/
					//}
					//console.log(st_time);
					if(s_time!=null){
						s_time="\""+s_time+"\"";
					}
					if(s_time==null){s_time=0;}
					console.log(s_time);
					}
					if (results==""){
						s_time=0;
					}
				});
			let sql_redUserNS='select red_user_info.name, red_user_info.surname from battles left join competition_users on battles.red_user_id=competition_users.user_id left join users as red_user_info on competition_users.user_id=red_user_info.id where battles.id='+req.query.id+' group by battles.id;'
	//let sql_redUserNS='select users.name, users.surname from battles join competition_users on battles.red_user_id=competition_users.user_id join users on competition_users.user_id=users.id where battles.'+req.params.id+' group by battles.id;'
		        connection.query(sql_redUserNS, (err,results)=>{
	                if(err) throw err;
	                var string = JSON.stringify(results);
	                var geted_d = JSON.parse(string);
	                red_name=geted_d[0].name;
					red_surname=geted_d[0].surname;
	                console.log(geted_d);
                });
			let sql_blueUserNS='select blue_user_info.name, blue_user_info.surname from battles left join competition_users on battles.blue_user_id=competition_users.user_id left join users as blue_user_info on competition_users.user_id=blue_user_info.id where battles.id='+req.query.id+' group by battles.id;'
				connection.query(sql_blueUserNS, (err,results)=>{
            	    if(err) throw err;
	                var string = JSON.stringify(results);
	                var geted_d = JSON.parse(string);
	                blue_name=geted_d[0].name;
					blue_surname=geted_d[0].surname;
	                console.log(geted_d);
	                //res.render('scoring.ejs',{ring_nr: ring_nr});
                });	
	
			let sql_red_club='select users.club from battles left join competition_users on battles.red_user_id=competition_users.user_id left join users on competition_users.user_id=users.id where battles.id='+req.query.id+' group by battles.id;'
				connection.query(sql_red_club, (err,results)=>{
	                if(err) throw err;
	                var string = JSON.stringify(results);
	                var geted_d = JSON.parse(string);
	                red_club=geted_d[0].club;
	                console.log(red_club);
               });	
			let sql_blue_club='select users.club from battles left join competition_users on battles.blue_user_id=competition_users.user_id left join users on competition_users.user_id=users.id where battles.id='+req.query.id+' group by battles.id;'
				connection.query(sql_blue_club, (err,results)=>{
            	    if(err) throw err; 
	                var string = JSON.stringify(results);
	                var geted_d = JSON.parse(string);
	                blue_club=geted_d[0].club;
	                console.log(blue_club);
                });	
			let sql_jscores='select battle_id, round_nr, judge_id, red_score, blue_score from battle_scores where battle_id='+req.query.id+' order by round_nr, judge_id;'
		        connection.query(sql_jscores, (err,results)=>{
	                if(err) throw err;
				 	var string = JSON.stringify(results);
	                var scores_data = JSON.parse(string);
					var red_res_round_1=0;
					var red_res_round_2=0;
					var red_res_round_3=0;
					var blue_res_round_1=0;
					var blue_res_round_2=0;
					var blue_res_round_3=0;
					var red_res_total=0;
					var blue_res_total=0;
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
								
									let sql_battlenr='select nr from battles where battles.id='+req.query.id+';'
										connection.query(sql_battlenr, (err,results)=>{
		                					if(err) throw err;
		                					var string = JSON.stringify(results);
							                var geted_d = JSON.parse(string);
							                battlenr=geted_d[0].nr;
							                //console.log(battlenr);
											console.log(round_1);
											console.log(round_2);
											console.log(round_3);
							                res.render('show.ejs',{ring_nr: ring_nr,
																	  battlenr: battlenr,
																	  rounds: rounds,
																	  rounds_time: rounds_time,
																	  st_time: st_time,
																   	  s_time: s_time,
																	  round_numb: round_nr,
																	  weight: weight,
																	  red_name: red_name,
																	  red_surname: red_surname,
																	  blue_name: blue_name,
																	  blue_surname: blue_surname,
																	  red_club: red_club,
																	  blue_club: blue_club,
																	  round_1: round_1,
																	  round_2: round_2,
																	  round_3: round_3,
																	  red_res_round_1: red_res_round_1,
																 	  red_res_round_2: red_res_round_2,
																  	  red_res_round_3: red_res_round_3,
																  	  blue_res_round_1: blue_res_round_1,
																  	  blue_res_round_2: blue_res_round_2,
																  	  blue_res_round_3: blue_res_round_3,
																	  red_res_total: red_res_total,
																 	  blue_res_total: blue_res_total
																	});
						                });
						
				}else{
					var r=round_nr;
					if(round_nr===0){
					console.log(rounds+"rounds");
					r=rounds;
					}
				let sql_judge_id='select judge_id from battle_scores where battle_id='+req.query.id+' and round_nr='+r+' order by round_nr, judge_id;'
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
							red_res_total=Number(red_res_round_1)+Number(red_res_round_2)+Number(red_res_round_3);
							blue_res_total=Number(blue_res_round_1)+Number(blue_res_round_2)+Number(blue_res_round_3);
								let sql_battlenr='select nr from battles where battles.id='+req.query.id+';'
									connection.query(sql_battlenr, (err,results)=>{
							        	if(err) throw err;
							            var string = JSON.stringify(results);
							            var geted_d = JSON.parse(string);
    							        battlenr=geted_d[0].nr;
							            console.log(battlenr);
							            res.render('show.ejs',{ring_nr: ring_nr,
										 						  battlenr: battlenr,
											  					  rounds: rounds,
																  rounds_time: rounds_time,
																  st_time: st_time,
															   	  s_time: s_time,
																  round_numb: round_nr,
																  weight: weight,
																  red_name: red_name,
															  	  red_surname: red_surname,
																  blue_name: blue_name,
																  blue_surname: blue_surname,
																  red_club: red_club,
																  blue_club: blue_club,
																  round_1: round_1,
																  round_2: round_2,
																  round_3: round_3,
																  red_res_round_1: red_res_round_1,
																  red_res_round_2: red_res_round_2,
																  red_res_round_3: red_res_round_3,
																  blue_res_round_1: blue_res_round_1,
																  blue_res_round_2: blue_res_round_2,
																  blue_res_round_3: blue_res_round_3,
																  red_res_total: red_res_total,
																  blue_res_total: blue_res_total
																});
								   });
							});
						}
					});
				}
			});
		});

module.exports=router;