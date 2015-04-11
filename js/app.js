// Enemies our player must avoid
var Enemy = function(timeToTraverse) {
; // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // set the initial enemay coordinates to
    // the botoom of the screen.
    this.x = 0;
    this.y = 0;
    this.time=timeToTraverse;
   
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // dt is the time in seconds since 
    // the last frame 
  
  var canvasInstance = $("canvas");
 // console.log("time to traverse is"+this.time);
   var width = canvasInstance[0].width;
   // recal distance = rate * time
   
   var desiredVelocity  = width/this.time;
   var deltaX = desiredVelocity*dt;
   this.x+=deltaX;
   



}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // var now = Date.now();
   //if (now % 10==0) {console.log("hello");}
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite='images/char-boy.png';
}

Player.prototype.update = function(dt) {

}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x,this.y);
}

player = new Player();


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var anEnemy = new Enemy(10);
//anEnemy.render();
var allEnemies = [anEnemy];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
