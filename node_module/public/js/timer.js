var round_n;
var st_time;
var checkstop=0;
function set_rounds_red(){
	var table1 = document.getElementById("table1");	
	if (rounds==1){	
		table1.deleteRow(3);
	}
	if (rounds==2){
		table1.deleteRow(4);
	}
}
function set_rounds_blue(){
	var table2 = document.getElementById("table2");
	if (rounds==1){
		table2.deleteRow(3);
	}
	if (rounds==2){
		table2.deleteRow(4);
	}
}
function check_begin(){
	if(s_time!=0){
		var date_start=new Date(s_time);
		var date_now=new Date();
		st_time=((date_now-date_start)/1000).toFixed();
		if (st_time<rounds_time){//fight go
			if (battle_status==0 && round_n==rounds){
				round_n=0;
			}
			start();	
		}
		if (st_time>=rounds_time && round_n==rounds){
			s_time=0;
			var battle_id = getUrlVars()["id"];
				var http = new XMLHttpRequest();
				var url = "/start_timer";
				var params = "round_status=false&battle_status=true&round_n="+round_n+"&battle_id="+battle_id;
				http.open("POST", url, true);
				http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				http.onreadystatechange = function() {//Call a function when the state changes.
    				if(http.readyState == 4 && http.status == 200) {
   						alert(http.responseText);
    				}
				}
				http.send(params);
				http.end;
		}
		if (st_time>=rounds_time){//fight stop
			
			if (round_n<rounds){
			round_n++;
			var battle_id = getUrlVars()["id"];
			var http = new XMLHttpRequest();
			var url = "/start_timer";
			var params = "round_status=false&battle_status=true&round_n="+round_n+"&battle_id="+battle_id;
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.onreadystatechange = function() {//Call a function when the state changes.
    			if(http.readyState == 4 && http.status == 200) {
        			alert(http.responseText);
    			}
			}
			
			if (round_n>rounds){
				round_n=0;
				var battle_id = getUrlVars()["id"];
				var http = new XMLHttpRequest();
				var url = "/start_timer";
				var params = "round_status=false&battle_status=false&round_n="+round_n+"&battle_id="+battle_id;
				http.open("POST", url, true);
				http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");ge
				http.onreadystatechange = function() {//Call a function when the state changes.
    				if(http.readyState == 4 && http.status == 200) {
   						alert(http.responseText);
    				}
				}
			}
			
			http.send(params);
			http.end;
			}
			
			console.log(round_n);
			if (round_n==0){
				var round_to_show=rounds;
				document.getElementById('rd_nr').innerHTML=round_to_show;
			}
			if (round_n<=rounds){
				document.getElementById('rd_nr').innerHTML=round_n;
			}
			st_time=0;
	
		}
	
	}
}

function begin(){
	round_n=round_number;
	//if (round_n==0){document.getElementById('rd_nr').innerHTML=rounds;}
}
function getUrlVars() {
	    var vars = {};
	    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, 
			function(m,key,value) {
			vars[key] = value;}); 
			return vars;
		}
function stop(){
	if (checkstop==0){
		checkstop=1;
		var bstart = document.getElementById("bstart");
		var bstop = document.getElementById("bstop");
		bstart.removeAttribute("disabled");
		bstart.style.display='block';
		bstop.style.display='none';
	}
}
function start(){
checkstop=0;
if (st_time!=0){
if(s_time==0){st_time=0;}
if(s_time!=0){
var date_start=new Date(s_time);
var date_now=new Date();
st_time=((date_now-date_start)/1000).toFixed();
}
}
console.log(st_time);
if (st_time>rounds_time){st_time=rounds_time;}
var SButton = document.getElementById("bstart");
var StopButton = document.getElementById("bstop");	
SButton.setAttribute("disabled","disabled");
var ctx = document.getElementById('my_canvas').getContext('2d');
var al = st_time;
var start = 4.72;
var cw = ctx.canvas.width;
var ch = ctx.canvas.height; 
var diff;
var http = new XMLHttpRequest();
	var url = "/start_timer";
	var params;
	if (round_n<=rounds && round_n>0){
				//round_n=round_n+1; 
				document.getElementById('rd_nr').innerHTML=round_n;
				var battle_id = getUrlVars()["id"];
				SButton.style.display='none';
				StopButton.style.display='block';
				  }
	else {alert('The battle end! Please choose another battle.'); SButton.removeAttribute("disabled"); return;}
	if (round_n==1){
		params = "round_status=true&battle_status=true&round_n="+round_n+"&battle_id="+battle_id;
	}
	if (round_n>1){
		params = "round_status=true&battle_status=true&round_n="+round_n+"&battle_id="+battle_id;
	}
	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
    	if(http.readyState == 4 && http.status == 200) {
        	alert(http.responseText);
    	}
	}
	http.send(params);
	http.end;
progressSim();
function progressSim(){
	diff = ((al / rounds_time) * Math.PI*2*10).toFixed(2);
	ctx.clearRect(0, 0, cw, ch);
	ctx.lineWidth = 30;
	ctx.fillStyle = '#3c3c3c';
	if(al >= (rounds_time-15)){
			ctx.strokeStyle = "#F1051E";
	}
	if(al <= (rounds_time-15)){
			ctx.strokeStyle = "#84FA16";
	}
	ctx.font = "50px Arial";
	ctx.textAlign = 'center';
	ctx.fillText(al, cw*.5, ch*.5+2, cw);
	ctx.beginPath();
	ctx.arc(150, 150, 130, start, diff/10+start, false);
	ctx.stroke();
	if(al == rounds_time){
			clearTimeout(sim);
			if (round_n<=rounds){round_n=round_n+1;}
			if (round_n>rounds){round_n=0;}
			var http = new XMLHttpRequest();
			var url = "/start_timer";
			var params = "round_status=false&battle_status=true&round_n="+round_n+"&battle_id="+battle_id;
			if (round_n==0){
				params = "round_status=false&battle_status=false&round_n="+round_n+"&battle_id="+battle_id;
			}
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.onreadystatechange = function() {//Call a function when the state changes.
		    	if(http.readyState == 4 && http.status == 200) {
		    	   	alert(http.responseText);
		    	}
			}
			http.send(params);
			http.end;
			battle_status=0;
			s_time=0;
			SButton.removeAttribute("disabled");
			StopButton.style.display='none';
			SButton.style.display='block';
		return;
		}
	if (checkstop==0){
		al++;
	}
}
var sim = setInterval(progressSim, 1000);};