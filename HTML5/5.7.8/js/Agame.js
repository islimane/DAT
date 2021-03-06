// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

//Level
var level = 1;
// states[i] -> [numOfStones, numOfMonsters, monster's speed]
var states = [
	[3, 3, 20],
	[4, 3, 30],
	[5, 4, 40],
	[5, 4, 40],
	[5, 5, 40],
	[7, 8, 50],
];

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var numOfStones = 2;
var maxStones = 7;
var stonesReady = false;
var stoneImages = [];
for(var i=0;i<maxStones;i++){
	stoneImages[i] = new Image();
	stoneImages[i].onload = function () {
		stonesReady = true;
	};
	stoneImages[i].src = "images/stone.png";
}

// monster image
var numOfMonsters = 1;
var maxMonsters = 8;
var monstersReady = false;
var monsterImages = [];
for(var i=0;i<maxMonsters;i++){
	monsterImages[i] = new Image();
	monsterImages[i].onload = function () {
		monstersReady = true;
	};
	monsterImages[i].src = "images/monster.png";
}


// Game objects

// HERO
var hero = {
	speed: 256 // movement in pixels per second
};

// PRINCESS
var princess = {};
var princessesCaught = 	localStorage.getItem("pri");
if(!princessesCaught){
	princessesCaught = 0;
}
var streak = 0;

// STONE
var stones = [];
for(var i=0;i<maxStones;i++){
	stones[i] = {};
}

// MONSTER
var monsters = [];
for(var i=0;i<maxMonsters;i++){
	monsters[i] = {
		speed: 20 // movement in pixels per second
	};
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Draw the stones without touching the hero
	for(var i=0;i<numOfStones;i++){
		while(true){
			stones[i].x = 32 + (Math.random() * (canvas.width - 96));
			stones[i].y = 32 + (Math.random() * (canvas.height - 96));
			if(!checkTouching(stones[i], hero))
				break;
		}
	}

	// Draw the princess without touching any stone
	exit = false;
	while(!exit){
		// Throw the princess somewhere on the screen randomly
		princess.x = 32 + (Math.random() * (canvas.width - 96));
		princess.y = 32 + (Math.random() * (canvas.height - 96));
		for(var i=0;i<numOfStones;i++){
			if(checkTouching(princess, stones[i])){
				break;
			}
			if(i==numOfStones-1)
				exit = true;
		}
		if(exit) break;
	}

	// Draw the monsters without touching any other object
	for(var i=0;i<numOfMonsters;i++){
		exit = false;
		while(!exit){
			// Throw the monster somewhere on the screen randomly
			monsters[i].x = 32 + (Math.random() * (canvas.width - 96));
			monsters[i].y = 32 + (Math.random() * (canvas.height - 96));
			// Check the moster is not touching any stone neither
			// the princess neither the hero
			if(!objectTouchesStone(monsters[i])||!checkTouching(monsters[i], princess)||!checkTouching(monsters[i], hero))
				exit = true;
		}
	}
};

// If the a object is touching any of the b object
// the function returns true
var checkTouching = function(a,b) {
		// Are they touching?
		if (a.x < (b.x + 32)
			&& b.x < (a.x + 32)
			&& a.y < (b.y + 32)
			&& b.y < (a.y + 32)){
			return true;
		}
	return false;
};

// If the object is touching on any stone
// the function returns true
var objectTouchesStone = function(object){
	for(var i=0;i<numOfStones;i++){
		if(checkTouching(object, stones[i])){
			return true;
			break;
		}
	}
	return false;
};

// Makes that a mobile object
// follows the hero
var followHero = function(object, modifier){
	if(object.x<hero.x)
		object.x += object.speed * modifier;
	if(object.x>hero.x)
		object.x -= object.speed * modifier;
	if(object.y<hero.y)
		object.y += object.speed * modifier;
	if(object.y>hero.y)
		object.y -= object.speed * modifier;
};

var updateState = function(){
	numOfStones = states[level-2][0];
	numOfMonsters = states[level-2][1];
	for(var i=0;i<numOfMonsters;i++){
		monsters[i].speed = states[level-2][2];
	}
}

// Update game objects
var update = function (modifier) {
	// Hero Control and check if the hero
	// is going out of the backgroud
	if (38 in keysDown && hero.y>32) // Player holding up
		hero.y -= hero.speed * modifier;
	if (40 in keysDown&& hero.y<413) // Player holding down
		hero.y += hero.speed * modifier;
	if (37 in keysDown && hero.x>32) // Player holding left
		hero.x -= hero.speed * modifier;
	if (39 in keysDown && hero.x<448)// Player holding right
		hero.x += hero.speed * modifier;

	// Is the princess and the hero touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		localStorage.setItem("pri", princessesCaught);
		if(++streak==5){
			if(++level==7)
				level=2;
			streak = 0;
			updateState();
		}
		reset();
	}

	// Is any monster touching the hero?
	for(var i=0;i<numOfMonsters;i++)
		if (checkTouching(monsters[i], hero)){
			princessesCaught=0;
			level = 1;
			numOfMonsters = 1;
			numOfStones = 2;
			monsters[0].speed = 20;
			streak = 0;
			localStorage.setItem("pri", princessesCaught);
			reset();
		}

	// If the hero is touching any stone
	// then the key is hold
	if(objectTouchesStone(hero)){
		if (38 in keysDown)
			hero.y += hero.speed * modifier;
		if (40 in keysDown)
			hero.y -= hero.speed * modifier;
		if (37 in keysDown)
			hero.x += hero.speed * modifier;
		if (39 in keysDown)
			hero.x -= hero.speed * modifier;
	}

	// Make the monsters "try" to catch the Hero
	for(var i=0;i<numOfMonsters;i++)
		followHero(monsters[i], modifier);
};

// Draw everything
var render = function () {
	if (bgReady)
		ctx.drawImage(bgImage, 0, 0);

	if (heroReady)
		ctx.drawImage(heroImage, hero.x, hero.y);

	if (princessReady)
		ctx.drawImage(princessImage, princess.x, princess.y);

	for(var i=0;i<numOfStones;i++)
		if (stonesReady)
			ctx.drawImage(stoneImages[i], stones[i].x, stones[i].y);

	for(var i=0;i<numOfMonsters;i++)
		if (monstersReady)
			ctx.drawImage(monsterImages[i], monsters[i].x, monsters[i].y);

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("LEVEL " + level, 370, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
