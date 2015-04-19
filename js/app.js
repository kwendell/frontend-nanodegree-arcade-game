
/*
 * the Model prototype will be used to maintain
 * all information to execute the game like
 * game state.
 */
var Model = function() {
    this.state="playing";
    this.numberOfLives = 3;
    var canvasInstance = $("canvas")[0];
    this.canvasWidth=canvasInstance.width;
    this.canvasHeight=canvasInstance.height;
}
Model.prototype.getState = function() {
    return this.state;
}
Model.prototype.setState = function(state) {
    this.state=state;
}
var Singleton = (function () {
    var instance;
 
    function createInstance() {
        var object = new Model();
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();




/* The Rectangle prototype is used to determine 
 * collisions by providing an intersects method.
 * Composition is preferred to inheritance, each
 * entity, enemy, player has an instance of a Rectangle
 */
var Rectangle = function(x,y,width,height) {
   
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
}
Rectangle.prototype.setX = function(x) {
    this.x=x;
   
}

Rectangle.prototype.setY = function(y) {
    this.y=y;
   
}

/*  This is a helper function for the the
 *  intersects() method.
 */
Rectangle.prototype.containsPoint= function(x,y) {
    var withinXBounds = (x<=this.x+this.width && x>=this.x) && (y<=this.y+this.height && y>=this.y);
    return withinXBounds;
}
Rectangle.prototype.intersects= function(otherRectangle) {
    // if any verties of the other rectangles 
    // are within this rectantle, return true
    var vertices = [[otherRectangle.x,otherRectangle.y],[otherRectangle.x+otherRectangle.width,otherRectangle.y],
    [otherRectangle.x+otherRectangle.width,otherRectangle.y+otherRectangle.height],[otherRectangle.x,otherRectangle.y+otherRectangle.height]];
    var retval = false;
    for (var i=0;i<vertices.length;i++)  {
        retval = retval || this.containsPoint(vertices[i][0],vertices[i][1]);
    }
    return retval;

}

/* The Enemy construct takes a 'timeToTraverse'
 * value to set the speed.
 */

var Enemy = function(timeToTraverse) {

    this.sprite = 'images/enemy-bug.png';
    this.time=timeToTraverse;
    this.rectangle = new Rectangle(0,0,101,171);
   
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
   
   var desiredVelocity  = canvasWidth/this.time;
   var deltaX = desiredVelocity*dt;
   var x = this.rectangle.x;
   x+=deltaX;
   // wrap the movement when it goes off-screen.
   x=x % canvasWidth;
   // stop the enemies if a player died
   if (Singleton.getInstance().getState()!="killed") {
      this.rectangle.setX(x);
   }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
 
   ctx.drawImage(Resources.get(this.sprite), this.rectangle.x, this.rectangle.y);
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite='images/char-boy.png';
    var width = 110;
    var height =171;
    // k2 todo, use model to access canvas dimensions
    
    
    var x=Singleton.getInstance().canvasWidth/2-101/2;
    var y=Singleton.getInstance().canvasHeight-height;
	this.rectangle = new Rectangle(x,y,width,height);
    this.dt=0;
    this.timeToFade = 3.0;
    this.currentAlpha = 1.0;
    


}

Player.prototype.update = function(dt) {
   // console.log(Singleton.getInstance().getState());
    //console.log(dt);
    this.dt=dt;
    for (var i=0;i<allEnemies.length;i++)  {
        if (this.rectangle.intersects(allEnemies[i].rectangle)) {

           
            if (Singleton.getInstance().getState()!="killed") {
            Singleton.getInstance().numberOfLives--;
             Singleton.getInstance().setState("killed");
            }
            if (Singleton.getInstance().numberOfLives==0) {
                console.log("GAME OVER");
            }
        }
    }

  

    
    

}
Player.prototype.render = function() {
    // If the player has a collision, sat the opacity 
     if (Singleton.getInstance().getState()=="killed")  {
     //   console.log(this.dt);
        ctx.save();
        this.currentAlpha = this.currentAlpha - (this.dt/this.timeToFade);
        if (this.currentAlpha>0) {
        ctx.globalAlpha=this.currentAlpha;
        
        ctx.drawImage(Resources.get(this.sprite), this.rectangle.x,this.rectangle.y); 
        } else {
            Singleton.getInstance().setState("playing");
            this.currentAlpha=1.0;
             var width = 110;
             var height =171;
             var x=505/2-101/2;
             var y=606-height;
             this.rectangle = new Rectangle(x,y,width,height);
        }
        ctx.restore();
        
    } else {
        ctx.drawImage(Resources.get(this.sprite), this.rectangle.x,this.rectangle.y); 
    }

    
}

Player.prototype.handleInput = function(keyCode) {
  if (Singleton.getInstance().getState()!="killed") {
    if (keyCode=="left") {
   
       this.rectangle.x-=canvasWidth/5;
       
       if (this.rectangle.x<0) {

        var x=canvasWidth+this.rectangle.x;
		this.rectangle.x=x;
       }
      

    } else if (keyCode=="right") {
       
        this.rectangle.x+=canvasWidth/5;
        if (this.rectangle.x+101>canvasWidth) {

        this.rectangle.x=this.rectangle.x-canvasWidth;
       }

    } else if (keyCode=="up") {
     
        this.rectangle.y-=canvasHeight/5;

    } else if (keyCode=="down") {
        
        this.rectangle.y+=canvasHeight/5;
    }

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
