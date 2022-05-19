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
var visibleId = "welcomeDiv"; // need to cange welcomeDiv
//var jsonData = require('./users.json'); 
var usersDict = {} 
usersDict["k"] = "k";
var num_of_ball = 70;
var balls_left;
var start_num_of_balls;
var num_of_5ball;
var num_of_15ball;
var num_of_25ball;

var choosen_color5;
var choosen_color15;
var choosen_color25;

var up_key ;
var down_key;
var right_key;
var left_key;

var corners_arr = [];
var ghosts_num = 4; 
var ghost_pos_arr = new Array();

var direction_pac = "R"; // defaultValue for packman dir 

var active_user;

var clock_game; // object on board is 12
var time_left = 60; 
var live_left = 5; 
var heart_game;
var bonus_game;
var slow_motion;
var time_interval_ghost_slow_motion = 250; //When Pacman eats the snail the speed of the monsters decreases by 10

var _sound = document.getElementById("myAudio");

 
var game_time;
var ghost_interval;


var ghost_pos_board;
var ghost_obj_arr;

var num_of_ball_;
var num_of_5ball_;
var num_of_15ball_;
var num_of_25ball_;
var choosen_color5_;
var choosen_color15_;
var choosen_color25_;
var time_left_;
var ghosts_num_;
var ghost_pic = ["images/red_ghost.png","images/yellow_ghost.png","images/pink_ghost.png","images/blue_ghost.png"]

$(document).ready(function() {
	context = canvas.getContext("2d");
	// Start(); //need move to login or new game
});

//-----------------------function to switch between 2 divs-----------------
function toggleDiv(ToDivId)
{
	if(visibleId == "game"){
		closeAllInterval();
		stopAudio();
	}
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
		// alert('Login successful');
		active_user = username;
		let form = $("#loginForm");
		form[0].reset();
		// need to open settign page ;
		toggleDiv('gameSettingsSection')
		return; 
	}
	else if (usersDict[username] && usersDict[username] != password) {
		alert('The password is not correct');
		return; 
	}
	// }
	alert("User is not exist");      
}


//--------------------handle About modal dialog--------------------- 
function handleAbout(){
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("aboutLink");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// close modal dialog on ESC key press
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
			modal.style.display = "none";
	}
  })
}

// ------------------------------------------------------------
window.addEventListener("keydown", function(e) {
	if(e.target.id === "upKeyInp"){
	   up_key = e.code; 
	   e.target.value = up_key;
	}
	if(e.target.id === "downKeyInp"){
	   down_key = e.code;
	   e.target.value = down_key;
	}
	if(e.target.id === "rightKeyInp"){
		right_key = e.code;
	   e.target.value = right_key;
	}
	if(e.target.id === "LeftKeyInp"){
	   left_key = e.code;
	   e.target.value = left_key;
	}

	} , true) ;


function updateSetting(){

	num_of_ball = document.getElementById('ballsNum').value;
	
	num_of_5ball = Math.floor(0.6 * num_of_ball);
	num_of_15ball = Math.floor(0.3 * num_of_ball);
	num_of_25ball = Math.floor(0.1 * num_of_ball);

	choosen_color5 = document.getElementById('ball_5_color').value;
	choosen_color15 = document.getElementById('ball_15_color').value;
	choosen_color25 = document.getElementById('ball_25_color').value;

	time_left = document.getElementById('gameTime').value;
	game_time = time_left;
	ghosts_num = document.getElementById('ghostsNum').value;


	toggleDiv('game')
	saveSetting()
	Start();

}

function saveSetting(){
	num_of_ball_ = num_of_ball;
	
	num_of_5ball_ = num_of_5ball;
	num_of_15ball_ = num_of_15ball;
	num_of_25ball_= num_of_25ball;

	choosen_color5_ = choosen_color5;
	choosen_color15_ = choosen_color15;
	choosen_color25_ = choosen_color25;

	time_left_ = game_time;
	ghosts_num_ = ghosts_num;
	
}
 function restoreSetting(){
	num_of_ball = num_of_ball_;
	num_of_5ball = num_of_5ball_;
	num_of_15ball = num_of_15ball_;
	num_of_25ball = num_of_25ball_;

	choosen_color5 = choosen_color5_;
	choosen_color15 = choosen_color15_;
	choosen_color25 = choosen_color25_;

	time_left = time_left_;
	live_left = 5;
	ghosts_num = ghosts_num_;
 }


function random_setting(){
	up_key =$("upKeyInp").value = "ArrowUp";
	down_key=$("#downKeyInp").value = "ArrowDown";
	right_key =$("#rightKeyInp").value = "ArrowRight";
	left_key = $("#LeftKeyInp").value = "ArrowLeft";

	num_of_ball = generateRandom(50,90);
	num_of_5ball = Math.floor(0.6 * num_of_ball);
	num_of_15ball = Math.floor(0.3 * num_of_ball);
	num_of_25ball = Math.floor(0.1 * num_of_ball);

	choosen_color5 = generateRandomColor()
	choosen_color15 = generateRandomColor()
	choosen_color25 = generateRandomColor()

	time_left = generateRandom(60,90);
	game_time = time_left;
	ghosts_num = generateRandom(1,4);

	toggleDiv('game')
	saveSetting()
	//keyboard
	Start();


}
function generateRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }
  
function generateRandom(min, max) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}
//-------------------About------------------------------------------
function about() {
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
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
			toggleDiv('loginForm');
		}
	});
	// ---------------------------------settings form validation ------------------------------------------

	$("#settingsForm").validate({
		rules: {
			ballsNum: {
				required: true
			},
			ball_5_color: {
				required: true
			},
			ball_15_color: {
				required: true
			},
			ball_25_color: {
				required: true
			},
			upKeyInp: {
				required: true,
				keyPressUnique: true
			},
			downKeyInp: {
				required: true,
				keyPressUnique: true
			},
			LeftKeyInp: {
				required: true,
				keyPressUnique: true
			},
			rightKeyInp: {
				required: true,
				keyPressUnique: true
			}
		},
		messages: {
			ballsNum: {
				required: "Please enter number of balls."
			},
			ball_5_color: {
				required: "Please enter balls color."
			},
			ball_15_color: {
				required: "Please enter balls color."
			},
			ball_25_color: {
				required: "Please enter balls color."
			},
			upKeyInp: {
				required: "Please enter up Key press.",
				keyPressUnique: "Please enter unique key press"

			},
			downKeyInp: {
				required: "Please enter down Key press.",
				keyPressUnique: "Please enter unique key press"
			},
			LeftKeyInp: {
				required: "Please enter left Key press.",
				keyPressUnique: "Please enter unique key press"
			},
			rightKeyInp: {
				required: "Please enter right Key press.",
				keyPressUnique: "Please enter unique key press"
			}

		},
		submitHandler: function() {

			updateSetting();
			let form = $("#settingsForm");
			form[0].reset();

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
	$.validator.addMethod("keyPressUnique", function() {
		let upKey = document.getElementById("upKeyInp").value;
		let downKey = document.getElementById("downKeyInp").value;
		let rightKey = document.getElementById("rightKeyInp").value;
		let leftKey = document.getElementById("LeftKeyInp").value;

		if(upKey == downKey || upKey == leftKey || upKey == rightKey ||downKey==leftKey|| downKey==rightKey || rightKey== leftKey){
			return false;
		}
		else{
			return true;
		}

	});
});

//////New game from the game page //////////////
function newGame(){
	closeAllInterval();
	restoreSetting();
	Start();

}


function playAudio() {
	document.getElementById("myAudio").play();
	document.getElementById("myAudio").volume = 0.2;
}

function stopAudio() {
	document.getElementById("myAudio").pause();
}

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
	// updateSetting();
	restoreSetting()
	score = 0;
	pac_color = "yellow";
	var cnt = 441;
	balls_left = num_of_ball;
	start_num_of_balls = num_of_ball;
	
	playAudio() ;
	// _sound.play();
	// _sound.volume =0.2;
	// objects clock and heart for the special functionality
	heart_game = new Object();
	slow_motion = new Object();
	clock_game = new Object();
	bonus_game = new Object();
	var emptyCell = findRandomEmptyCell(board);
	bonus_game.j = emptyCell[1];
	bonus_game.i = emptyCell[0];

	ghost_pos_board = new Array();
	ghost_obj_arr = new Array();

	heart_game.exist = false;
	heart_game.eaten = false;

	slow_motion.exist = false;

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
	// num_of_ball = start_num_of_balls;
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.code] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.code] = false;
		},
		false
	);
	
	interval = setInterval(UpdatePosition, 100);
	clock_interval = setInterval(updateClock ,4000);
	heart_interval = setInterval(updateHeart ,5000);
	slow_motion_interval = setInterval(updateSlowMotion, 20000);
  	putGhostOnCorners();
	ghost_interval = setInterval(UpdateGhosts, 250);
  	// timeGhostInterval(time_interval_ghost_slow_motion);
	bonus_interval = setInterval(UpdateBonus, 500);
}



function timeGhostInterval(time){
	window.clearInterval(ghost_interval);
	ghost_interval = setInterval(UpdateGhosts, time);
}


// ---------------------------------add clock to the board----------------------------------


function updateClock(){ 
	if(clock_game.exist == false){
		var emptyCell = findRandomEmptyCell(board);
		clock_game.i = emptyCell[0];
		clock_game.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = 12; 
		clock_game.exist = true;
	}
}
//----------------------add slow motion to the board------------------------

function updateSlowMotion(){ 
	if(slow_motion.exist == false){
		var emptyCell = findRandomEmptyCell(board);
		slow_motion.i = emptyCell[0];
		slow_motion.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = 40; 
		slow_motion.exist = true;
	}
}
//----------------------add heart to the board------------------------

function updateHeart(){ 
	if(heart_game.exist == false){
		var emptyCell = findRandomEmptyCell(board);
		heart_game.i = emptyCell[0];
		heart_game.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = 13; 
		heart_game.exist = true;
	}
}

//----------------------add bonus to the board------------------------

function UpdateBonus(){ 
	// var emptyCell = findRandomEmptyCell(board);
	// bonus_game.i = emptyCell[0];
	// bonus_game.j = emptyCell[1];
	// board[emptyCell[0]][emptyCell[1]] = 50; 	
	var randomNum = Math.floor(Math.random()*4) //number in range 0-3
	if(randomNum == 0){//right
		if(bonus_game.i < cols - 1  && board[bonus_game.i+1][bonus_game.j] != 4 && noGhost(bonus_game.i+1,bonus_game.j)){
			bonus_game.i++;
			
		}
	}
	else if(randomNum == 1){//left
		if(bonus_game.i > 0 && board[bonus_game.i-1][bonus_game.j] != 4 && noGhost(bonus_game.i-1,bonus_game.j)){
			bonus_game.i--;
		
		}
	}
	else if(randomNum == 2){//up
		if(bonus_game.j < rows - 1  && board[bonus_game.i][bonus_game.j+1] != 4 && noGhost(bonus_game.i,bonus_game.j+1)){
			bonus_game.j++;
		
		}
	}
	else if(randomNum == 3){//down
		if(bonus_game.j >0  && board[bonus_game.i][bonus_game.j-1] != 4 && noGhost(bonus_game.i,bonus_game.j-1)){
			bonus_game.j--;
			
		}
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

	}
}


function noGhost(ghostX, ghostY) {
	for(var k=0; k< ghost_pos_arr.length; k++)
		if (ghostX == ghost_pos_arr[k].i && ghostY == ghost_pos_arr[k].j)
			return false;
	return true;
}


function UpdateGhosts(){
	var up;
	var down;
	var left;
	var right;

	for(var k=0 ; k<ghost_pos_arr.length; k++){
		up=1000;
		down=1000;
		left=1000;
		right=1000;

		up = Math.abs(ghost_pos_arr[k].i - shape.i) + Math.abs((ghost_pos_arr[k].j - 1) - shape.j);
		down = Math.abs( ghost_pos_arr[k].i - shape.i) + Math.abs((ghost_pos_arr[k].j + 1) - shape.j);	
		left = Math.abs((ghost_pos_arr[k].i-1) - shape.i) + Math.abs(ghost_pos_arr[k].j - shape.j);
		right = Math.abs((ghost_pos_arr[k].i+1) - shape.i) + Math.abs(ghost_pos_arr[k].j - shape.j);
		var minDist= Math.min(right,down,left,up);
		
		if(minDist == up)
			if(ghost_pos_arr[k].j > 0 && board[ghost_pos_arr[k].i][ghost_pos_arr[k].j-1] != 4 && noGhost(ghost_pos_arr[k].i,ghost_pos_arr[k].j-1))
			ghost_pos_arr[k].j--;
			
		if(minDist == down)
			if(ghost_pos_arr[k].j < rows - 1 && board[ghost_pos_arr[k].i][ghost_pos_arr[k].j+1] != 4 && noGhost(ghost_pos_arr[k].i,ghost_pos_arr[k].j+1))
				ghost_pos_arr[k].j++;

		if(minDist == left)
			if(ghost_pos_arr[k].i > 0 && board[ghost_pos_arr[k].i-1][ghost_pos_arr[k].j] != 4 && noGhost(ghost_pos_arr[k].i-1,ghost_pos_arr[k].j))
				ghost_pos_arr[k].i--;

		if(minDist == right)
			if(ghost_pos_arr[k].i < cols - 1  && board[ghost_pos_arr[k].i+1][ghost_pos_arr[k].j] != 4 && noGhost(ghost_pos_arr[k].i+1,ghost_pos_arr[k].j))
			ghost_pos_arr[k].i++;

		
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
	if (keysDown[up_key]) { 
		return 1;
	}
	if (keysDown[down_key]) {
		return 2;
	}
	if (keysDown[left_key]) {
		return 3;
	}
	if (keysDown[right_key]) {

		return 4;
	}
}


function setlabel(){
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblGameTime.value = game_time;
	lblNumOfBall.value = num_of_ball_;
	lblLive.value = live_left;
	lblUser.value = active_user;
	lblUpKey.value = up_key;
	lblDownKey.value = down_key;
	lblRightKey.value = right_key;
	lblLeftKey.value = left_key;
	lblGhosts.value = ghosts_num;
	lbl5ballColor.style["background-color"] = choosen_color5;
	lbl15ballColor.style["background-color"] = choosen_color15;
	lbl25ballColor.style["background-color"] = choosen_color25;

}

// ////////////////Draw//////////////////////////

function Draw() {
	canvas.width = canvas.width; //clean board
	setlabel();
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
				context.fillStyle = "blue"; //color
				context.fill();
			}
			else if(board[i][j] == 12){ //clock
				context.beginPath();
				var clock_image = new Image();
				clock_image.src = "images/clock.png";
				context.drawImage(clock_image,center.x-20 , center.y-20 , 50,50)		
			}
			else if(board[i][j] == 13){ //Heart
				context.beginPath();
				var Heart_image = new Image();
				Heart_image.src = "heart.png";
				context.drawImage(Heart_image,center.x-20 , center.y-20 , 50,50)		
			}
		
			else if(board[i][j] == 40){ //slow motion
				context.beginPath();
				var slow_motion_image = new Image();
				slow_motion_image.src = "images/slow_motion.png";
				context.drawImage(slow_motion_image,center.x-20 , center.y-20 , 50,50)	
					
			}

		
			// draw_ghost(context,30,30);
			draw_ghost();
			draw_bonus();

			
        // console.log("here")
		}
	}
}

// disable up and down arrow downscroll !! 
var keys = {};
window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
false);
window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
false);

function draw_bonus(){ 
	var center = new Object();
	center.y = bonus_game.j * 2* 30 + 30;
	center.x = bonus_game.i* 2 * 30 + 30;

	context.beginPath();
	var Bonus_image = new Image();
	Bonus_image.src = "images/bonus1.png";
	context.drawImage(Bonus_image,center.x-20 , center.y-20 , 50,50)	
}

function draw_ghost() {
	for (var k=0; k<ghost_pos_arr.length; k++) {
		var center = new Object();
		center.y = ghost_pos_arr[k].j * 2* 30 + 30;
		center.x = ghost_pos_arr[k].i* 2 * 30 + 30;

		context.beginPath();
		var image = new Image();
		image.src = ghost_pic[k];
		context.drawImage(image,center.x-30, center.y -30, 2* 30 ,2* 30 )
	}

}
  function closeAllInterval(){
	window.clearInterval(ghost_interval);
	window.clearInterval(interval);
	window.clearInterval(clock_interval);
	window.clearInterval(bonus_interval);
	window.clearInterval(heart_interval);
  }
  function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
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
	else if(board[shape.i][shape.j] == 12){ //clock
		time_left += 10;
		clock_game.exist = false;

	}
	else if(board[shape.i][shape.j] == 13){ //heart
		live_left += 1;
		heart_game.exist = false;
	}
	else if(shape.i== bonus_game.i && shape.j == bonus_game.j){ //bonus
		score += 50;
		var emptyCell = findRandomEmptyCell(board);
		bonus_game.j = emptyCell[1];
		bonus_game.i = emptyCell[0];
	}

	else if(board[shape.i][shape.j] == 40){ //slow motion
		time_interval_ghost_slow_motion+=50;
		timeGhostInterval(time_interval_ghost_slow_motion);
		slow_motion.exist = false;
	}

	for (var k=0; k<ghosts_num; k++) {
		if(shape.i == ghost_pos_arr[k].i && shape.j == ghost_pos_arr[k].j){
			live_left--;
			score -= 10;
			if(live_left > 0){
				putGhostOnCorners();
				var emptyCell = findRandomEmptyCell(board);
				shape.i = emptyCell[0];
				shape.j = emptyCell[1];
			}
			else{
				// Swal.fire('Any fool can use a computer')
				stopAudio();
				alert("Loser!");
				
				newGame();
				// closeAllInterval();
				// restoreSetting();
				// Start();
			// TODO: have to start a new game here!
			}
		}	
	}
	// time_elapsed = time_left;
	if(parseInt(time_elapsed) == time_left  ){
		if(score < 100){
			alert("You are better then " + score + " point!");
			closeAllInterval();
		}
		else{
			alert("Winner!")
			closeAllInterval();
			Start();
		}
	}
	if(balls_left == 0){
		alert("Winner!")
		closeAllInterval();
		Start();
	}
    
	board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;

    if (live_left >=5 && score >= 40 && time_elapsed <= 100) {
    	pac_color = "red";
    }
	else{
		pac_color = "yellow";
	}
    // if (score == 50) {
    // 	window.clearInterval(interval);
    // 	window.alert("Game completed");
    // } else {
	
      Draw();
    // }
}
