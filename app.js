var rows = 21; 
var cols = 21; 

var context;
var shape = new Object();
var board;
var dialog;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var visibleId = "game"; // need to cange welcomeDiv
//var jsonData = require('./users.json'); 
var usersDict = {} 
usersDict["k"] = "k";
var num_of_ball = 70;
var balls_left;

var num_of_5ball;
var num_of_15ball;
var num_of_25ball;

var choosen_color5;
var choosen_color15;
var choosen_color25;

var corners_arr = [];
var ghosts_num = 4; // defaultValue for ghosts num
var ghost_pos_arr = [];

var direction_pac = "R"; // defaultValue for packman dir 

var active_user;

var clock_game; // object on board is 12
var time_left;
var live_left;

var heart_game;

var ghost_interval;


var ghost_pos_board;
var ghost_obj_arr;

$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});

//-----------------------function to switch between 2 divs-----------------
function toggleDiv(ToDivId)
{
	document.getElementById(visibleId).style.display = 'none';
	document.getElementById(ToDivId).style.display = 'block';
	visibleId = ToDivId;
} 

//--------------------------Login form--------------------------------
//--------------------jquery validation of Login form--------------------- 
$("#logInForm").validate({
	rules: {
		logIn_name: {
			required: true,
		},
		logIn_password: {
			required: true,
			validateUser: true
		}
	},
	messages: {
		logIn_name: {
			required: "Please enter username."
		},
		logIn_password: {
			required: "Please enter an password",
			validateUser: "Username or password is not valid."
		}
	},
	submitHandler: function () {
		game_username = document.getElementById("userName").value;
		//document.getElementById("NotLogIn").style.display = "none";
		// UserScreenON();
		// settingON();
		//reset form details
		let form = $("#logInForm");
		form[0].reset();
		toggleDiv('gameSettingsSection');


	}
	
});

//--------------------jquery validation of Setting form--------------------- 

$("#setting_form").validate({
	rules: {
		RIGHT_name: {
			keyChangeCheck:true,
		},
		duration_name: {
			gameTimeMoreThen60: 60
		}
	},
	messages: {
		RIGHT_name: {			
			keyChangeCheck: "This key already taken by another action."
		},
		duration_name: {
			gameTimeMoreThen60: "Minimum game duration is 60 second."
		}
	},
	submitHandler: function () {
		Start();
		// UserScreenConsoleON();
	}
});

//--------------------jquery validation of Sign Up form--------------------- 
$(document).ready(function() {
	$("#signupForm").validate({
		rules: {
			username: {
				required: true,
				usernameExists: true
			},
			password: {
				required: true,
				strongPassword: true
			},
			fullName: {
				required: true,
				lettersonly : true
			},
			email: {
				required: true,
				email: true
			},
			birthDate: {
				required: true
			}
		},
		messages: {
			username: {
				required: "Please enter valid username.",
				usernameExists: "this username already exist, please enter another valid username."
			},
			password: {
				required: "Please enter a valid password.",
				strongPassword: "password must be with at least 6 character and at least one letter and one number."
			},
			fullName: {
				required: "Please enter your full name.",
				lettersonly: "full name must contain only letters."
			},
			email: {
				required: "Please enter a valid email address.",
				email: "email in not valid, please enter a valid email address."
			},
			birthDate: {
				required: "Please enter your birth date."
			}
		},
		submitHandler: function() {
			//add user to users dict
			let username = document.getElementById("username").value;
			let password = document.getElementById("password").value;
			usersDict[username] = password;
			let form = $("#signupForm");
			form[0].reset();
			// form.submit();
			toggleDiv('welcomeDiv');
		}
	});
});



//-------------functions fo jquery validation of Sign Up form-----------------
$(function() {
	// password must be with at least 6 character and at least one letter and one number.
	$.validator.addMethod('strongPassword', function (value) {
		return value.length >= 6 &&
			/\d/.test(value) &&
			/[a-z]/i.test(value);
	});

    //check if username already exists
	$.validator.addMethod('usernameExists', function (user) {
		if(user in usersDict) {
			return false;
		}
		else{
			return true;
		}
	});
});


function Start() {
	board = 
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 4, 0, 4, 4, 4, 4, 4, 0, 4, 4, 4, 0, 4, 0, 0, 0, 0, 0],
		[0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 4, 4, 4, 4],
		[0, 4, 0, 4, 0, 4, 0, 0, 4, 0, 4, 4, 0, 4, 4, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 4, 4, 4, 0, 0, 4, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 4, 0, 4, 0, 0, 0, 4, 0],
		[0, 4, 4, 4, 4, 0, 0, 4, 4, 0, 4, 0, 0, 4, 0, 0, 0, 4, 0, 4, 4],
		[0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 0, 0, 0],
		[0, 4, 4, 0, 0, 0, 4, 0, 4, 4, 4, 4, 0, 4, 0, 0, 0, 4, 4, 4, 0],
		[0, 4, 0, 0, 4, 0, 4, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0],
		[0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 4, 4, 4, 4, 0, 4],
		[4, 4, 4, 4, 4, 0, 4, 0, 4, 0, 0, 4, 4, 4, 4, 0, 0, 0, 4, 0, 4],
		[0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
		[0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 4, 0, 0, 0],
		[0, 4, 4, 4, 4, 0, 4, 0, 4, 4, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 4, 4, 0, 4, 0, 4, 0, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4],
		[0, 4, 0, 4, 0, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 4, 0, 4, 4, 0, 4, 0, 4, 0, 4, 0, 4, 4, 4, 0, 0, 0, 0],
		[0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0],
	];
	updateSetting();
	score = 0;
	pac_color = "yellow";
	var cnt = 441;
	balls_left = num_of_ball;
	// objects clock and heart for the special functionality
	heart_game = new Object();
	clock_game = new Object();

	ghost_pos_board = new Array();
	ghost_obj_arr = new Array();


	heart_game.exist = false;
	heart_game.eaten = false;

	clock_game.exist = false;
	clock_game.eaten = false;

	var pacman_remain = 1;
	
	//num_of_ball = document.getElementById('ballsNum').value;
	start_time = new Date();
	for (var i = 0; i < rows; i++) {
		ghost_pos_board[i] = new Array();
		for (var j = 0; j < cols; j++) {
			if (board[i][j] != 4) {
				var randomNum = Math.random(); 
				if (randomNum <= (1.0 * num_of_ball) / cnt) {  //add food
					randomNum = Math.floor(Math.random() *3); 
					if(randomNum== 0 && num_of_5ball != 0){
						board[i][j] = 5;
						num_of_5ball--;
					}
					else if(randomNum == 1 && num_of_15ball != 0){
						board[i][j] = 15;
						num_of_15ball--;
					}
					else if(randomNum== 2 && num_of_5ball != 0){
						board[i][j] = 25;
						num_of_25ball--;
					}
					else{
						board[i][j] = 0;
						num_of_ball++;
					}
					num_of_ball--;
					
				} else if (randomNum < (1.0 * (pacman_remain + num_of_ball)) / cnt) {  // add pacman
					if(i!=0 && i!=rows-1 && j!=0 && j!=cols-1){
						shape.i = i;
						shape.j = j;
						pacman_remain--;
						board[i][j] = 2;
					}
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	// addGhosts();
	while (num_of_ball > 0) {
		var emptyCell = findRandomEmptyCell(board);
		if(num_of_5ball != 0){
			board[emptyCell[0]][emptyCell[1]]= 5;
			num_of_5ball--;
		}
		else if(num_of_15ball != 0){
			board[emptyCell[0]][emptyCell[1]] = 15;
			num_of_15ball--;
		}
		else if(num_of_5ball != 0){
			board[emptyCell[0]][emptyCell[1]] = 25;
			num_of_25ball--;
		}
		num_of_ball--;
	}
	while(pacman_remain != 0 ){
		var emptyCell = findRandomEmptyCell(board);
		if(emptyCell[0]!=0 && emptyCell[0]!=rows-1 && emptyCell[1]!=0 && emptyCell[1]!=cols-1){
			shape.i = emptyCell[0];
			shape.j = emptyCell[1];
			pacman_remain--;
			board[emptyCell[0]][emptyCell[1]] = 2;
		}
	}

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	
	interval = setInterval(UpdatePosition, 120);
	clock_interval = setInterval(updateClock ,4000);
	heart_interval = setInterval(updateHeart ,5000);
  	putGhostOnCorners();
  	ghost_interval = setInterval(UpdateGhosts, 120);
}


// ---------------------------------add clock to the board----------------------------------

function updateSetting(){
	num_of_ball = document.getElementById('ballsNum').value;
	
	num_of_5ball = Math.floor(0.6 * num_of_ball);
	num_of_15ball = Math.floor(0.3 * num_of_ball);
	num_of_25ball = Math.floor(0.1 * num_of_ball);

	choosen_color5 = document.getElementById('ball_5_color').value;
	choosen_color15 = document.getElementById('ball_15_color').value;
	choosen_color25 = document.getElementById('ball_25_color').value;

}

function updateClock(){ 
	if(clock_game.exist == false){
		var emptyCell = findRandomEmptyCell(board);
		clock_game.i = emptyCell[0];
		clock_game.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = 12; 
		clock_game.exist = true;
	}
}

function updateHeart(){ 
	if(heart_game.exist == false){
		var emptyCell = findRandomEmptyCell(board);
		clock_game.i = emptyCell[0];
		clock_game.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = 13; 
		heart_game.exist = true;
	}
}


function putGhostOnCorners(){
	corners_arr[0]=[0,0];
	corners_arr[1]=[0,cols-1];
	corners_arr[2]=[rows-1,0];
	corners_arr[3]=[rows-1,cols-1];
	for(var i=0; i <ghosts_num;i++)
	{
		ghost_pos_arr[i] = new Object(); //state object
		ghost_pos_arr[i].i = corners_arr[i][0];
		ghost_pos_arr[i].j = corners_arr[i][1];
		// var ghost = ghost_pos_arr[i];
		// ghost_pos_arr[i].path = constructPathBFS(corners_arr[i][0], corners_arr[i][1]);
	}
}


function noGhost(ghostX, ghostY) {
	for(var k=0; k< ghosts_num; k++)
		if (ghostX == ghost_pos_arr[k].i && ghostY == ghost_pos_arr[k].j)
			return false;
	return true;
}


function UpdateGhosts(){
	// var distsleft;
	// var distright;
	// var distup;
	// var distdown;
	//check randomly if calc the dist by i or by j, the minimal distance between x and y position
	var pac_ghost_dist_i; 
	var pac_ghost_dist_j;
	var random_position;

	for(var k=0 ; k<ghosts_num; k++){
		// distsleft=rows*cols;
		// distright=rows*cols;
		// distup=rows*cols;
		// distdown=rows*cols;
		random_position = Math.random() * 2 ; // Returns a random integer from 0 to 1
		pac_ghost_dist_i = ghost_pos_arr[k].i  - shape.i; 
		pac_ghost_dist_j = ghost_pos_arr[k].j  - shape.j; 
		
		var minDist= Math.min(Math.abs(pac_ghost_dist_i),Math.abs(pac_ghost_dist_j));
		if(minDist == Math.abs(pac_ghost_dist_i)){//i is the minima dist
			// if(pac_ghost_dist_i <0 && ghost_pos_arr[k].i <rows-1 && board[ghost_pos_arr[k].i][ghost_pos_arr[k].j] != 4 && noGhost(ghost_pos_arr[k].i,ghost_pos_arr[k].j)){//move up
			var next_up = ghost_pos_arr[k].i + 1;
			var next_down = ghost_pos_arr[k].i - 1;
			if((pac_ghost_dist_i < 0  )&& ghost_pos_arr[k].i <rows-1 && board[next_up][ghost_pos_arr[k].j] != 4 && noGhost(next_up, ghost_pos_arr[k].j)){	
			//move up
				ghost_pos_arr[k].i++;
			}
			else if((pac_ghost_dist_i >=0) && ghost_pos_arr[k].i >0 && board[next_down][ghost_pos_arr[k].j] != 4 && noGhost(next_down, ghost_pos_arr[k].j)){	
			//move down
				ghost_pos_arr[k].i--;
			}
		}
		if(minDist == Math.abs(pac_ghost_dist_j)){//check dist by j position
			var next_right = ghost_pos_arr[k].j + 1;
			var next_left = ghost_pos_arr[k].j - 1;
			if((pac_ghost_dist_j < 0 ) && ghost_pos_arr[k].j < cols-1 && board[ghost_pos_arr[k].i][next_right] != 4 && noGhost(ghost_pos_arr[k].i, next_right)){
			//move left
				ghost_pos_arr[k].j--;	
			}
			else if((pac_ghost_dist_j >= 0) && ghost_pos_arr[k].j > 0 && board[ghost_pos_arr[k].i][next_left] != 4 && noGhost(ghost_pos_arr[k].i, next_left)){
			//move right
				ghost_pos_arr[k].j++;	
			}
		}
	}
		
	}



function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 20 + 1);
	var j = Math.floor(Math.random() * 20 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 20 + 1);
		j = Math.floor(Math.random() * 20 + 1);
	}
	return [i, j];
}


function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}
// ////////////////Draw//////////////////////////

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	activeuser.value = active_user;
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {  // draw pacman
				if (direction_pac == 'R'){
					context.beginPath();
					context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				} 
				else if(direction_pac == 'L'){
					context.beginPath();
					context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				}
				else if(direction_pac == 'U'){
					context.beginPath();
					context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 9, center.y - 4, 5, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				}
				else if(direction_pac == 'D'){
					context.beginPath();
					context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x - 9, center.y + 4, 5, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				}

			} else if (board[i][j] == 5) {// ball_5
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = choosen_color5; //color
				context.fill();
			} else if (board[i][j] == 15) { // ball_15
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = choosen_color15; //color
				context.fill();
			} else if (board[i][j] == 25) { //ball_25
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = choosen_color25; //color
				context.fill();

			} else if (board[i][j] == 4) { // wall
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "black"; //color
				context.fill();
			}
			else if(board[i][j] == 12){ //clock
				context.beginPath();
				var clock_image = new Image();
				clock_image.src = "images/clock.png";
				context.drawImage(clock_image,center.x-5 , center.y-5 , 50,50)		
			}
			else if(board[i][j] == 13){ //Heart
				context.beginPath();
				var Heart_image = new Image();
				Heart_image.src = "heart.png";
				context.drawImage(Heart_image,center.x-5 , center.y-5 , 50,50)		
			}
		
			draw_ghost(context,30,30);

			
        // console.log("here")
		}
	}
}

function draw_ghost(ctx,height,width){
    for (var k=0; k<ghost_pos_arr.length; k++) {
      x = ghost_pos_arr[k].i * 2* 30 + 30;
      y = ghost_pos_arr[k].j* 2 * 30 + 30;
      ctx.beginPath();
      ctx.fillStyle = "blue" ;
      ctx.arc(x , y, width, Math.PI, 2* Math.PI);
      ctx.lineTo(x + width, y + height);
      ctx.arc(x + width / 2, y + height, width * 0.5, 0, Math.PI);
      ctx.arc(x + width / 2 - width , y + height, width * 0.5, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
  }


  function UpdatePosition() {
    board[shape.i][shape.j] = 0;
    var x = GetKeyPressed();
    if (x == 1) {
      if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
        shape.j--;
        direction_pac = 'U'
      }
    }
    if (x == 2) {
      if (shape.j < cols-1 && board[shape.i][shape.j + 1] != 4) {
        shape.j++;
        direction_pac = 'D'
      }
    }
    if (x == 3) {
      if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
        shape.i--;
        direction_pac = 'L'
      }
    }
    if (x == 4) {
      if (shape.i < rows-1 && board[shape.i + 1][shape.j] != 4) {
        shape.i++;
        direction_pac = 'R'
      }
    }


    if (board[shape.i][shape.j] == 5) {
      score+=5;
      balls_left--;
    }
    else if (board[shape.i][shape.j] == 15) {
      score+=15;
      balls_left--;
    }
    else if (board[shape.i][shape.j] == 25) {
      score+=25;
      balls_left--;
    }
	else if(board[shape.i][shape.j] == 12){
		time_left += 10;
		clock_game.exist = false;

	}
	else if(board[shape.i][shape.j] == 13){
		live_left += 1;
		heart_game.exist = false;
	}
    
	board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    // if (score >= 20 && time_elapsed <= 10) {
    // 	pac_color = "green";
    // }
    // if (score == 50) {
    // 	window.clearInterval(interval);
    // 	window.alert("Game completed");
    // } else {
	
      Draw();
    // }
}