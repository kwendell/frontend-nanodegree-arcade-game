
/*
 * the Model prototype will be used to maintain
 * all information to execute the game like
 * game state and canvas dimension.
 */
var Model = function() {
    this.state="playing";
    this.numberOfLives = 3;
    var canvasInstance = $("canvas")[0];
    this.canvasWidth=canvasInstance.width;
    this.canvasHeight=canvasInstance.height;
    this.value=0;
}
Model.prototype.getState = function() {
    return this.state;
}
Model.prototype.setState = function(state) {
    this.state=state;
}
Model.prototype.setValue = function(value) {
   this.value=value;
}
Model.prototype.getValue = function() {
  return this.value;
}
/*
 * Wrap the model in a Singleton f
 */

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
 
//var tempWidth = 0;
var Enemy = function(timeToTraverse,row) {
  this.SPACE=60;
  this.width=98;
  this.height=77;
 

    this.sprite = 'images/enemy-trump.png';
    this.time=timeToTraverse;


    
    //this.rectangle = new Rectangle(-this.width/2,row*this.height+this.SPACE,this.width,this.height);
    this.rectangle = new Rectangle(-this.width/2,row*this.height+this.SPACE,this.width,this.height);
    Enemy.instanceCounter++;
  
   
   
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
   // defer setting rectangle dimensions until onLoad happens.

  
 
   var desiredVelocity  = canvasWidth/this.time;
   var deltaX = desiredVelocity*dt;
   var x = this.rectangle.x;
   x+=deltaX;
   // wrap the movement when it goes off-screen.
   //x=x % canvasWidth;
   if (x>canvasWidth) {
    x=-98;
   }
   // stop the enemies if a player died
   if (Singleton.getInstance().getState()!="killed") {
      this.rectangle.setX(x);
   }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
 //console.log("enemy render");
   ctx.drawImage(Resources.get(this.sprite), this.rectangle.x, this.rectangle.y);
}
/*
 * Add instance counter at class scope 
 * to keep track of number of enemies.   This
 * is used to set the y-coordinate in the 
 * enemy constructor.
 */
Enemy.instanceCounter = 0;



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite='images/char-boy.png';
    this.width = 101;
    this.height =88;
    // k2 todo, use model to access canvas dimensions
    
    
    this.startX=Singleton.getInstance().canvasWidth/2-this.width/2;
    this.startY=Singleton.getInstance().canvasHeight-this.height-44;
	  this.rectangle = new Rectangle(this.startX,this.startY,this.width,this.height);
    this.dt=0;
    this.timeToFade = 2.0;
    this.currentAlpha = 1.0;
    


}

Player.prototype.update = function(dt) {
   
    this.dt=dt;
    /*
     * Check to see if the player has collided with any enemies.   If so,
     * set the appropriate game state.
     */
    for (var i=0;i<allEnemies.length;i++)  {
        if (this.rectangle.intersects(allEnemies[i].rectangle) && Singleton.getInstance().getState()!="made it") {

           
            if (Singleton.getInstance().getState()!="killed") {
            Singleton.getInstance().numberOfLives--;
             Singleton.getInstance().setState("killed");
             //console.log(this.rectangle.x+", "+this.rectangle.y.toFixed(0)+", "+this.rectangle.width+", "+ this.rectangle.height);
              //sconsole.log(allEnemies[i].rectangle.x.toFixed(0)+", "+allEnemies[i].rectangle.y.toFixed(0)+", "+allEnemies[i].rectangle.width+", "+ allEnemies[i].rectangle.height);
            
              }
            if (Singleton.getInstance().numberOfLives==0) {
                Singleton.getInstance().setState("gameOver");
            }
        }
    }

    if (Singleton.getInstance().getState()=="killed")  {

    }

  

    
    

}
Player.prototype.render = function() {
   
    if (Singleton.getInstance().getState()=="killed")  {
        // save the context
        ctx.save();
        this.currentAlpha = this.currentAlpha - (this.dt/this.timeToFade);
        // decrease the opacity to show player dying.
        if (this.currentAlpha>0) {
             ctx.globalAlpha=this.currentAlpha;
             ctx.drawImage(Resources.get(this.sprite), this.rectangle.x,this.rectangle.y); 
        } else {
            Singleton.getInstance().setState("playing");
            // reset the position
            this.rectangle.setX(Singleton.getInstance().canvasWidth/2-this.width/2);
            this.rectangle.setY(Singleton.getInstance().canvasHeight-this.height-44);
            this.currentAlpha=1.0;
        }
        //restore the context
        ctx.restore();

    } else if (Singleton.getInstance().getState()=="made it") {
      // draw a star at the player location that made it.
         
      ctx.drawImage(Resources.get("images/Star.png"),this.rectangle.x,this.rectangle.y);

      // draw the player in the starting position
      
      
      this.rectangle.x=Singleton.getInstance().canvasWidth/2-this.width/2;
      this.rectangle.y=Singleton.getInstance().canvasHeight-this.height-44;
      ctx.drawImage(Resources.get("images/char-boy.png"),this.rectangle.x,this.rectangle.y);
      Singleton.getInstance().setState("playing");


    
	}
	else {

        Singleton.getInstance().setState("playing");
        this.currentAlpha=1.0;
           

       


         ctx.drawImage(Resources.get(this.sprite), this.rectangle.x,this.rectangle.y); 

    }
      
        
    // else {
       
    //}

    
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
     
        this.rectangle.y-=canvasHeight/6;
        if (this.rectangle.y<0)  {
            Singleton.getInstance().setState("made it");
			this.rectangle.y=0;
		
        }

    } else if (keyCode=="down") {
      //  var updatedY = this.rectangle+canvasHeight/6;
		//this.rectangle.y= Math.min(updatedY,canvasHeight-44);
		var newY = this.rectangle.y+canvasHeight/6;
		if (newY+44<canvasHeight) {
          this.rectangle.y=newY;
	    }
	  
	   
    }

}

    // update the rectantle

}




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var thePlayer = new Player();
var player = thePlayer;


var anEnemy = new Enemy(4,0);
var anotherEnemy = new Enemy(4,0);
var add = new Enemy(5,1);
var yetAnotherEnemy = new Enemy(5,1);
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
