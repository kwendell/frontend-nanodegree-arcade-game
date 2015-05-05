frontend-nanodegree-arcade-game
===============================
Game Play Instructions:

The game is in play mode when the url is requested.  The object is to make it
to the top for each of the five columns   The player has three 3
lives. When the player gets down to 2 lives the blue gem reward will start 
moving across the screen.  If the player can collide with the reward, the 
player will become invincible for a limited time.   When the player
is invincible the player image will change.  When the 3 player lives are
expended a 'Game Over' message will be shown giving the player the option
to play again.  This is accomplished by hitting the ENTER key.

Player Controls:
The arrow keys are used to control the movement of the player.

Key=Left Arrow: Moves the player one column to the left, unless player is at the leftmost column.
In that condition, the player will not continue to move to the left.

Key=Right Arrow: Moves the player one column to the right, unless player is at the rightmost column.
In that condition, the player will not continue to move to the right.

Key=Up Arrow:  Moves the player up one row per key press until the player reaches the top.  
If the player reaches the top, a star is placed in the column and the player's position
is reset to the starting position.

Key=Down Arrow:  Moves the player down one row per key press until the player reaches the bottom
column.  If the player reaches the bottom, pressing the Down Arrow Key will have no effect.   This
is desired as the player should not be allowed to move off of the screen.


Resources, Acknowledgements:

For this project I used w3schools javascript tutorial pages.   I used an MDN
article at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain.

I used stackoverflow liberally for problems with canvas and just about anything
else.





Students should use this rubric: https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797

for self-checking their submission.
