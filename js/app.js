
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
}
Model.prototype.getState = function() {
    return this.state;
}
Model.prototype.setState = function(state) {
    this.state=state;
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

var Enemy = function(timeToTraverse,row) {
    
   

    this.sprite = 'images/enemy-bug.png';
    this.time=timeToTraverse*2;
    
    this.rectangle = new Rectangle(98*Enemy.instanceCounter*2,row*77+94,98,77);
    Enemy.instanceCounter++;
  
   
   
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
    this.height =89;
    // k2 todo, use model to access canvas dimensions
    
    
    var x=Singleton.getInstance().canvasWidth/2-this.width/2;
    var y=Singleton.getInstance().canvasHeight-this.height;
	this.rectangle = new Rectangle(x,y-44,this.width,this.height);
    this.dt=0;
    this.timeToFade = 2.0;
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
             //console.log(this.rectangle.x+", "+this.rectangle.y.toFixed(0)+", "+this.rectangle.width+", "+ this.rectangle.height);
              //sconsole.log(allEnemies[i].rectangle.x.toFixed(0)+", "+allEnemies[i].rectangle.y.toFixed(0)+", "+allEnemies[i].rectangle.width+", "+ allEnemies[i].rectangle.height);
            }
            if (Singleton.getInstance().numberOfLives==0) {
                Singleton.getInstance().setState("gameOver");
            }
        }
    }

  

    
    

}
Player.prototype.render = function() {
    // If the player has a collision, sat the opacity 
   // console.log(Singleton.getInstance().getState());
 //  console.log(Singleton.getInstance().getState());
// console.log(Singleton.getInstance().getState());
    if (Singleton.getInstance().getState()=="killed")  {
        // save the context
        ctx.save();
        this.currentAlpha = this.currentAlpha - (this.dt/this.timeToFade);
        // draw the transparent player dying
        if (this.currentAlpha>0) {
             ctx.globalAlpha=this.currentAlpha;
             ctx.drawImage(Resources.get(this.sprite), this.rectangle.x,this.rectangle.y); 
        } else {
            Singleton.getInstance().setState("playing");
            // reset the position
            this.rectangle.setX(Singleton.getInstance().canvasWidth/2-this.width/2);
            this.rectangle.setY(Singleton.getInstance().canvasHeight-this.height-44);
        }
        //restore the context
        ctx.restore();
    } else {
        Singleton.getInstance().setState("playing");
        this.currentAlpha=1.0;
           
        //var x=Singleton.getInstance().canvasWidth/2-this.width/2;
        //var y=Singleton.getInstance().canvasHeight-this.height-44;
         ctx.drawImage(Resources.get(this.sprite), this.rectangle.x,this.rectangle.y); 
             //this.rectangle = new Rectangle(x,y-44,this.width,this.height);
      //  this.rectangle = new Rectangle(x,y-44,this.width,this.width);
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
			console.log(this.rectangle.y);
          //  var column = 5 - Singleton.getInstance().canvasWidth/(this.rectangle.x+this.rectangle.width);
            //column = column.toFixed(0);
            var columnWidth = Singleton.getInstance().canvasWidth/5;
           // console.log((this.rectangle.x+this.rectangle.width)/columnWidth);
            
            /*
             * reset the player position.
             */
             //this.rectangle.setX(Singleton.getInstance().canvasWidth/2 - this.width/2);
            // this.rectangle.setY(Singleton.getInstance().canvasHeight-this.height);
        }

    } else if (keyCode=="down") {
      //  var updatedY = this.rectangle+canvasHeight/6;
		//this.rectangle.y= Math.min(updatedY,canvasHeight-44);
		var newY = this.rectangle.y+canvasHeight/6;
		if (newY+44<canvasHeight) {
          this.rectangle.y=newY;
	    }
	   console.log(this.rectangle.y);
	   
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
