
/*
 * the Model prototype will be used to maintain
 * information to execute the game like
 * game state and canvas dimension.
 */
var Model = function() {
    this.state="playing";
    this.numberOfLives = 3;
    var canvasInstance = $("canvas")[0];
    this.canvasWidth=canvasInstance.width;
    this.canvasHeight=canvasInstance.height;
    this.isRewardInPlay=false;

}

Model.prototype.getState = function() {
    return this.state;
}
Model.prototype.setState = function(state) {
    this.state=state;
}
Model.prototype.getCanvasWidth = function() {
  return this.canvasWidth;
}
Model.prototype.getCanvasHeight = function() {
  return this.canvasHeight;
}
Model.prototype.getIsRewardInPlay = function() {
  return this.isRewardInPlay;
}
Model.prototype.setIsRewardInPlay = function(isRewardInPlay) {
  this.isRewardInPlay=isRewardInPlay;
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
 * entity, (enemy, player and reward) has an instance of a Rectangle
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
/*
 * The insterects method is used to determine collisions.
 */

Rectangle.prototype.intersects= function(otherRectangle) {
    // if any verties of the other rectangles
    // are within this rectantle, return true
    var retval = false;
    var vertices = [[otherRectangle.x,otherRectangle.y],[otherRectangle.x+otherRectangle.width,otherRectangle.y],
    [otherRectangle.x+otherRectangle.width,otherRectangle.y+otherRectangle.height],[otherRectangle.x,otherRectangle.y+otherRectangle.height]];

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

  this.sprite = "images/enemy-bug.png";
  this.time=timeToTraverse;
  this.x=-101;
  this.y=row*83-7;
  this.rectangleOffsetY=75;


  this.rectangle = new Rectangle(this.x,this.y+this.rectangleOffsetY,101,77);


}

/*
 * the Enemy::update method is used to
 * update the position, game state.
 */

Enemy.prototype.update = function(dt) {

   var desiredVelocity  = canvasWidth/this.time;
   var deltaX = desiredVelocity*dt;
   var x = this.x;
   x+=deltaX;
   // wrap the movement when it goes off-screen.
   //x=x % canvasWidth;
   if (x>canvasWidth) {
    x=-this.rectangle.width;
   }
   // stop the enemies if a player died
   if (Singleton.getInstance().getState()!="killed") {
      this.rectangle.setX(x);
	  this.x=x;
   }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
 //console.log("enemy render state = "+Singleton.getInstance().getState());
 if (Singleton.getInstance().getState()!="gameOver") {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
 }
}





// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite='images/char-boy.png';
    this.width = 101;
    this.height =171;
    this.rectangleOffsetY=63;
    this.horizontalLeniency=22
    // k2 todo, use model to access canvas dimensions


    this.x=2*this.width;
    this.startX=this.x;

    this.startY=83*5;
    this.y=this.startY;

	  this.rectangle = new Rectangle(this.startX+this.horizontalLeniency,this.startY+this.rectangleOffsetY,this.width-2*this.horizontalLeniency,86);
    this.dt=0;
    // Parameters to fade the player when colliding.
    this.timeToFade = 2.0;
    this.currentAlpha = 1.0;
    this.isInvincible = false;
    this.timeToBeInvincible = 5;

}

Player.prototype.setIsInvincible = function(isInvincible)  {
  this.isInvincible=isInvincible;
  if (isInvincible)  {

    this.timeToBeInvincible=3;
    this.sprite="images/char-boy-invincible.png";

  } else {
    this.timeToBeInvincible=0;
    this.sprite="images/char-boy.png";
  }
}

Player.prototype.setX = function(newX) {
this.x=newX;
this.rectangle.x=newX+this.horizontalLeniency;

}

Player.prototype.setY = function(newY) {
this.y=newY;
this.rectangle.y=newY+this.rectangleOffsetY;

}



Player.prototype.resetPosition = function() {
  this.x=this.startX;
  this.y=this.startY;
  this.rectangle.x=this.startX+this.horizontalLeniency;
  this.rectangle.y=this.startY+this.rectangleOffsetY;
}

Player.prototype.update = function(dt) {

  this.dt=dt;
 /*
  * Check to see if the player has collided with any enemies.   If so,
  * set the appropriate game state.
  */



  for (var i=0;i<allEnemies.length;i++)  {

    if (this.rectangle.intersects(allEnemies[i].rectangle) && Singleton.getInstance().getState()!="made it" && this.isInvincible==false) {

      if (Singleton.getInstance().getState()!="killed" && Singleton.getInstance().getState()!="gameOver") {
        Singleton.getInstance().numberOfLives--;
        if (Singleton.getInstance().numberOfLives<3) {
          Singleton.getInstance().setIsRewardInPlay(true);

        }
        Singleton.getInstance().setState("killed");

	  }
      if (Singleton.getInstance().numberOfLives==0) {
        Singleton.getInstance().setState("gameOver");
      }
    }
  }
   /*
    * If the player has collided with a reward, make the player invincible
    * for three seconds.
    */
  for (var j=0;j<allRewards.length;j++)  {

    if (Singleton.getInstance().getIsRewardInPlay() && this.rectangle.intersects(allRewards[j].rectangle) &&
      Singleton.getInstance().getState()=="playing") {

        this.setIsInvincible(true);
        /*
         * Turn off the reward while invincible
         */
        Singleton.getInstance().setIsRewardInPlay(false);


    }
  }

  if (this.isInvincible)  {
    this.timeToBeInvincible-=dt;
    if (this.timeToBeInvincible <= 0) {
      this.setIsInvincible(false);
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
      ctx.drawImage(Resources.get(this.sprite), this.x,this.y);
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

    ctx.drawImage(Resources.get("images/Star.png"),this.x,this.y);

    // draw the player in the starting position

    this.resetPosition();

    ctx.drawImage(Resources.get("images/char-boy.png"),this.x,this.y);
    Singleton.getInstance().setState("playing");

	} else if (Singleton.getInstance().getState()=="gameOver") {
    ctx.font = "bold 36pt  Impact";
    ctx.lineWidth=3;
    ctx.strokeStyle='#000000';
    ctx.fillStyle="rgba(255, 255, 255, 0.0)";
    ctx.strokeText("Game Over",  20, 40);
    ctx.strokeText("Press the ENTER key" ,  20, 80);
    ctx.strokeText("to play again." ,  20, 120);

  }
	else {

    this.currentAlpha=1.0;
    ctx.drawImage(Resources.get(this.sprite), this.x,this.y);

  }

}

Player.prototype.handleInput = function(keyCode) {
  if (Singleton.getInstance().getState()=="playing") {
    if (keyCode=="left") {

      if (this.x-this.rectangle.width>=0) {

        var newX =this.x-(this.rectangle.width+2*this.horizontalLeniency);
		    this.setX(newX);
      }


    } else if (keyCode=="right") {
      if (this.x+2*this.rectangle.width<=canvasWidth) {
        var newX=this.x+(this.rectangle.width+2*this.horizontalLeniency);
		    this.setX(newX);
      }



    } else if (keyCode=="up") {

      var newY=this.y-83;

	    this.setY(newY);



      if (newY<0)  {
        Singleton.getInstance().setState("made it");
			  //this.rectangle.y=0;

        }

    } else if (keyCode=="down") {
      if (this.y+83+this.rectangle.height+23<canvasHeight) {
        var newY =this.y+83;
		    this.setY(newY);
      }
    }
  }  else  if (Singleton.getInstance().getState()=="gameOver" ) {
    if (keyCode=="enter") {

      Singleton.getInstance().numberOfLives=3;
      Singleton.getInstance().setState("playing");
      this.resetPosition();
      ctx.clearRect(0,0,Singleton.getInstance().getCanvasWidth(),Singleton.getInstance().getCanvasHeight());
      Singleton.getInstance().setIsRewardInPlay(false);
    }


  }


}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//var thePlayer = new Player();
var player = new Player();
var bug0 = new Enemy(2,1)
var bug1 = new Enemy(3,2);
var bug2 = new Enemy(4,3);

/*
 *  Create a reward object
 */

var Reward = function() {

  this.sprite = "images/Gem Blue.png";
  this.timeToTraverse=2;

  this.rectangle = new Rectangle(0,canvasHeight/4-171/2,101,111);

}

Reward.prototype.update = function(dt) {

 var distance = dt*(Singleton.getInstance().getCanvasWidth()/this.timeToTraverse);
 this.rectangle.x+=distance;
 this.rectangle.x=this.rectangle.x % Singleton.getInstance().getCanvasWidth();

 var normalizedRadians = (2*Math.PI)*(this.rectangle.x/Singleton.getInstance().getCanvasWidth());

 this.rectangle.y+=Math.sin(normalizedRadians);


 }


Reward.prototype.render = function()  {

 /*
  * Do not show the reward until the player is down to
  * two lives.
  */

  if (Singleton.getInstance().getIsRewardInPlay()==true && Singleton.getInstance().getState()=="playing") {
    ctx.drawImage(Resources.get('images/Gem Blue.png'),this.rectangle.x,this.rectangle.y);
  }

}
var reward = new Reward();

var allEnemies = [bug0,bug1,bug2];
var allRewards = [reward];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };


    player.handleInput(allowedKeys[e.keyCode]);
});
