
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
var Enemy = function(x,y,width,height,imageUrl,timeToTraverse,row) {
 
  this.sprite = imageUrl;
  this.time=timeToTraverse;

  this.rectangle = new Rectangle(x,y,width,height);

 
} 

/*  Add class scoope variable for the Enemy width */
Enemy.width=98;




Enemy.prototype.update = function(dt) {
  
   var desiredVelocity  = canvasWidth/this.time;
   var deltaX = desiredVelocity*dt;
   var x = this.rectangle.x;
   x+=deltaX;
   // wrap the movement when it goes off-screen.
   //x=x % canvasWidth;
   if (x>canvasWidth) {
    x=-Enemy.width;
   }
   // stop the enemies if a player died
   if (Singleton.getInstance().getState()!="killed") {
      this.rectangle.setX(x);
   }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
 //console.log("enemy render state = "+Singleton.getInstance().getState());
 if (Singleton.getInstance().getState()!="gameOver") {
   ctx.drawImage(Resources.get(this.sprite), this.rectangle.x, this.rectangle.y);
 }
}





// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite='images/char-boy.png';
    this.width = 101;
    this.height =88;
    // k2 todo, use model to access canvas dimensions
    
    
    this.startX=Singleton.getInstance().canvasWidth/2-this.width/2;
    this.startY=Singleton.getInstance().canvasHeight-this.height-this.height/2;
	  this.rectangle = new Rectangle(this.startX,this.startY,this.width,this.height);
    this.dt=0;
    // Parameters to fade the player when colliding.
    this.timeToFade = 2.0;
    this.currentAlpha = 1.0;
    


}


Player.prototype.resetPosition = function() {
    this.rectangle.x=this.startX;//ingleton.getInstance().canvasWidth/2-this.width/2;
      this.rectangle.y=this.startY;//Singleton.getInstance().canvasHeight-this.height;
}

Player.prototype.update = function(dt) {
   
    this.dt=dt;
    /*
     * Check to see if the player has collided with any enemies.   If so,
     * set the appropriate game state.
     */
    for (var i=0;i<allEnemies.length;i++)  {
        if (this.rectangle.intersects(allEnemies[i].rectangle) && Singleton.getInstance().getState()!="made it") {

           
            if (Singleton.getInstance().getState()!="killed" && Singleton.getInstance().getState()!="gameOver") {
            Singleton.getInstance().numberOfLives--;
             Singleton.getInstance().setState("killed");
            
            
              }
            if (Singleton.getInstance().numberOfLives==0) {
                Singleton.getInstance().setState("gameOver");
                //console.log("setting state to g")

            }
        }
    }

  

    
 

}
Player.prototype.render = function() {
    
    if (Singleton.getInstance().getState()=="killed")  {
        // save the context
        ctx.save();
        this.currentAlpha = this.currentAlpha - (this.dt/this.timeToFade);
        // decrease the opacity to show player perishing.
        if (this.currentAlpha>0) {
             ctx.globalAlpha=this.currentAlpha;
             ctx.drawImage(Resources.get(this.sprite), this.rectangle.x,this.rectangle.y); 
        } else {
            Singleton.getInstance().setState("playing");
            // reset the position
          
            this.resetPosition();
            this.currentAlpha=1.0;
        }
        //restore the context
        ctx.restore();

    } else if (Singleton.getInstance().getState()=="made it") {
      // draw a star at the player location that made it.
         
      ctx.drawImage(Resources.get("images/Star.png"),this.rectangle.x,this.rectangle.y);

      // draw the player in the starting position
      
      this.resetPosition();
      /*
      this.rectangle.x=Singleton.getInstance().canvasWidth/2-this.width/2;
      this.rectangle.y=Singleton.getInstance().canvasHeight-this.height-this.height;
      */
      ctx.drawImage(Resources.get("images/char-boy.png"),this.rectangle.x,this.rectangle.y);
      Singleton.getInstance().setState("playing");


    
	   } else if (Singleton.getInstance().getState()=="gameOver") {
            //console.log("game over");
     }
	   else {

   
        this.currentAlpha=1.0;
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

////this.rectangle = new Rectangle(-this.width,row*this.height+this.SPACE,this.width,this.height);
//var rectangleTrump = new Rectangle(-80,1*80+60 ,80,101);

var trump = new Enemy(-80,110-101/2,80,101,'images/enemy-trump.png',4,0);
var bug = new Enemy(-98+canvasWidth/2,110-77/2,98,77,'images/enemy-bug.png',4,0);

var bug2 = new Enemy(-98,240-77/2,98,77,'images/enemy-bug.png',5,0);
var coulter = new Enemy(-87+canvasWidth/2,2*90,87,90,'images/enemy-coulter.png',5,0);
var allEnemies = [trump,bug, bug2, coulter];

/* use prototype chaining 
 * to subclass an Enemy instance
 */
 var rewardToBe = new Enemy(-87+canvasWidth/2,2*90,87,90,'images/Gem Blue.png',5,0);
var reward = Object.create(rewardToBe);
reward.sprite="images/Gem Blue.png";
reward.rectangle.width=101;
reward.rectangle.height=171;
reward.rectangle.y=300;
reward.update = function(dt) {
 // console.log("reward update function.");
 this.sprite="images/Gem Blue.png";
 this.rectangle.x=20;
 this.rectangle.y=20;
 this.render(dt);
}
reward.render = function(dt)  {
  //console.log(this.sprite);
  var img = new Image();
  img.src="images/Gem Blue.png";
   ctx.drawImage(img, 20,20);
   //console.log(this.rectangle.x); 

}


//var bug = new Enemy('images/enemy-bug.png', 3,0);

//anEnemy.render();



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
