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
var heart_game;

var ghost_interval;

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
function Login()
{
	var username = document.getElementById('userName').value
	var password = document.getElementById('Password').value
	// for (let i = 0; i < usersArr.length; i++) { 
	if (usersDict[username] && usersDict[username] == password) {
		alert('Login successful');
		toggleDiv('gameSettingsSection');
		// need to open settign page ;
		active_user = username;
		return; 
	}
	else if (usersDict[username] && usersDict[username] != password) {
		alert('The password is not correct');
		return; 
	}
	// }
	alert("User is not exist");      
}





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
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 4, 0, 4, 4, 4, 4, 4, 0, 4, 4, 4, 0, 4, 0, 0, 0, 0, 0],
		[0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 4, 4, 4, 4],
		[0, 4, 0, 4, 0, 4, 0, 0, 4, 0, 4, 4, 0, 4, 4, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 4, 4, 4, 0, 0, 4, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
		[0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 4, 0, 4, 0, 0, 4, 4, 0],
		[0, 4, 4, 4, 4, 0, 0, 4, 4, 0, 4, 0, 0, 4, 0, 0, 0, 4, 0, 4, 4],
		[0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 0, 0, 0],
		[0, 4, 4, 0, 0, 0, 4, 0, 4, 4, 4, 4, 0, 4, 0, 0, 0, 4, 0, 0, 0],
		[0, 4, 0, 0, 4, 0, 4, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0],
		[0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 4, 4, 4, 4, 0, 0],
		[4, 4, 4, 4, 4, 0, 4, 0, 4, 0, 0, 4, 4, 4, 4, 0, 0, 0, 4, 0, 0],
		[0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
		[0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 4, 4, 0, 0],
		[0, 4, 4, 4, 4, 0, 4, 0, 4, 4, 0, 4, 4, 4, 4, 0, 0, 0, 4, 0, 0],
		[0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
		[0, 4, 0, 4, 4, 0, 4, 0, 4, 0, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4],
		[0, 4, 0, 4, 0, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 4, 0, 4, 4, 0, 4, 0, 4, 0, 4, 0, 4, 4, 4, 0, 0, 0, 0],
		[0, 4, 0, 4, 0, 0, 4, 0, 4, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0],
		[0, 4, 0, 4, 0, 0, 4, 0, 4, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0],
	];
	score = 0;
	pac_color = "yellow";
	var cnt = 441;
	balls_left = num_of_ball;
	// objects clock and heart for the special functionality
	heart_game = new Object();
	clock_game = new Object();


	heart_game.exist = false;
	heart_game.eaten = false;

	clock_game.exist = false;
	clock_game.eaten = false;

	var pacman_remain = 1;
	updateSetting();
	//num_of_ball = document.getElementById('ballsNum').value;
	start_time = new Date();
	for (var i = 0; i < rows; i++) {
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
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
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
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		pacman_remain--;
		board[emptyCell[0]][emptyCell[1]] = 2;
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
	
	interval = setInterval(UpdatePosition, 250);
	clock_interval = setInterval(updateClock ,200);
  putGhostOnCorners();
  ghost_interval = setInterval(UpdateGhosts, 170);
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
	if(clock_game.exist){
		var emptyCell = findRandomEmptyCell(board);
		clock_game.i = emptyCell[0];
		clock_game.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = 12; 
		clock_game.exist = true;
	}
}

function putGhostOnCorners(){
	corners_arr[0]=[0,0];
	corners_arr[1]=[0,cols-1];
	corners_arr[2]=[rows-1,0];
	corners_arr[3]=[rows-1,cols-1];
	for(var i=0; i <ghosts_num;i++)
	{
		// board[corners_arr[i][0]][corners_arr[i][1]]= 20;
    ghost_pos_arr[i] = new Object(); //state object
    ghost_pos_arr[i].i = corners_arr[i][0];
    ghost_pos_arr[i].j = corners_arr[i][1];
    ghost_obj_arr[i].path = constructPathBFS(ghost_pos_arr[i], shape);
	}
}


function noGhost(ghostX, ghostY) {
	for(var k=0; k<ghost_pos_arr.length; k++)
		if (ghostX == ghost_pos_arr[k].i && ghostY == ghost_pos_arr[k].j)
			return false;
	return true;
}


function UpdateGhosts(){
	for (var i = 0 ; i < ghost_pos_arr.length ; i++){

		var ghost = ghost_pos_arr[i]; //ghost state 
    var nextState = ghost_pos_arr[i].path.pop(); // path constructerd in BFS function
    ghost = nextState; // moves the ghost to the next neighbors state 
	

}

//from,to can be the indexes of the from=ghost, to=pacman - turn each position to state with state.i and state.j
function constructPathBFS(from, to){
  var visited = new Set(); 
  var queue = [from]; //***from is a state object

  while(queue.length > 0){ 
      var curState = queue.pop(); 
      visited.add(curState); 

      if(curState.i == to.i && curState.j == to.j){ // if we've reached the destination
          var solPath = []; // begin path construction
          var curr = curState; 
          while(curr.i !== from.i && curr.j !== from.j){
              solPath.push(current);
              curr = curr.prev;
          }
          solPath.push(from);
          solPath.reverse();// change from dest - start, to start - dest
          return solPath; // the fully constructed path
      }
      var neighbors = getAllNeighbors(curState);
      for (var i = 0 ; i < neighbors.length ; i++){
        if (!(neighbors[i] in visited)){
          neighbors[i].prev = curState;
          visite.add([neighbors[i]]);
          queue.push(neighbors[i]);
        }
      }
  }
  return [] // no path found
}

function getNeighbors(state){
	var neighbors = new Array();
	if (state.j > 0 && board[state.i][state.j - 1] != 4){
		var up = new Object;
		up.i = state.i;
		up.j = state.j - 1;
		neighbors.push(up);
	}
	if(state.j < boardCol - 1 && board[state.i][state.j + 1] != 4){
		var down = new Object;
		down.i = state.i;
		down.j = state.j + 1;
		neighbors.push(down);
	}
	if(state.i > 0 && board[state.i - 1][state.j] != 4){
		var left = new Object;
		left.i = state.i - 1;
		left.j = state.j;
		neighbors.push(left);
	}
	if(state.i < boardRow - 1 && board[state.i + 1][state.j] != 4){
		var rightState = new Object;
		rightState.i = state.i + 1;
		rightState.j = state.j;
		neighbors.push(rightState);
	}
	return neighbors;
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
				// context.beginPath();
				var clock_image = new Image();
				clock_image.src = "images/clock.png";
				context.drawImage(clock_image,center.x-5 , center.y-5 , 20,20)		
			}
      draw_ghost(context,30,30);
        // console.log("here")
		}
	}
}

function draw_ghost(ctx,height,width){
    for (var k=0; k<ghost_pos_arr.length; k++) {
      y = ghost_pos_arr[k].i * 2* 30 + 30;
      x = ghost_pos_arr[k].j* 2 * 30 + 30;
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
      if (shape.j < 16 && board[shape.i][shape.j + 1] != 4) {
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
      if (shape.i < 20 && board[shape.i + 1][shape.j] != 4) {
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
