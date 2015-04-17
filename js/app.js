// Enemies our player must avoid
// Model prototype constructor

//canvasWidth=505;
//canvasHeight=606;
//  Rectantgle prototype constructor
var Rectangle = function(x,y,width,height) {
    console.log("calling rectangle constructor");
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
}
Rectangle.prototype.setX = function(x) {
    this.x=x;
   
}
Rectangle.prototype.containsPoint= function(x,y) {
    var withinXBounds = (x<=this.x+this.width && x>=this.x) && (y<=this.y+this.height && y>=this.y);
    return withinXBounds;
}
Rectangle.prototype.intersects= function(otherRectangle) {
    // if any verties of the other rectangle 
    // are within this rectantle return true
    var vertices = [[otherRectangle.x,otherRectangle.y],[otherRectangle.x+otherRectangle.width,otherRectangle.y],
    [otherRectangle.x+otherRectangle.width,otherRectangle.y+otherRectangle.height],[otherRectangle.x,otherRectangle.y+otherRectangle.height]];
    var retval = false;
    for (var i=0;i<vertices.length;i++)  {
        retval = retval || this.containsPoint(vertices[i][0],vertices[i][1]);
    }
    return retval;

}

var Enemy = function(timeToTraverse,index) {
 // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';


    // set the initial enemay coordinates to
    // the botoom of the screen.
    this.x = 0;
    this.y = 0;
    this.time=timeToTraverse;
    this.index=index;
    this.height = 171;
    this.width = 101;
    this.rectangle = new Rectangle(this.x,this.y,this.width,this.height);
   
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
   
  
 // console.log("time to traverse is"+this.time);
   var width = canvasWidth;//canvasInstance[0].width;
   
   var desiredVelocity  = width/this.time;
   var deltaX = desiredVelocity*dt;
   this.x+=deltaX;
   // wrap the movement when it goes off-screen.
   this.x=this.x % width;

  // console.log(this.rectangle);
   // update rectantgle
   //this.rectangle.setLocation(this.rectangle,this.x,this.y);
   //this.x=this.x & width;



}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);


   //if (now % 10==0) {console.log("hello");}
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite='images/char-boy.png';
   // var canvasInstance = $("canvas");
 // console.log("time to traverse is"+this.time);
  // var width = canvasInstance[0].width;
  // var height = canvasInstance[0].height;
 
   
    this.width = 110;
    this.height =171;

   
    // k2 todo, use model to access canvas dimensions
    this.x=505/2-101/2;
    this.y=606-this.height;


}

Player.prototype.update = function(dt) {

   


}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x,this.y);
}

Player.prototype.handleInput = function(keyCode) {
  
    if (keyCode=="left") {
       
       //k2 todo use singleton to access tile dimnsions
      
       this.x-=canvasWidth/5;
       
       if (this.x<0) {

        this.x=canvasWidth+this.x;
       }
      

    } else if (keyCode=="right") {
       
        this.x+=canvasWidth/5;
        if (this.x+101>canvasWidth) {

        this.x=this.x-canvasWidth;
       }

    } else if (keyCode=="up") {
     
        this.y-=canvasHeight/5;

    } else if (keyCode=="down") {
        
        this.y+=canvasHeight/5;
    }

    // update the rectantle

}




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var thePlayer = new Player();
var player = thePlayer;


var anEnemy = new Enemy(10,0);
var anotherEnemy = new Enemy(6,1);
//anEnemy.render();
var allEnemies = [anEnemy, anotherEnemy];


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
