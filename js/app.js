var theScore     = 0,
    canvasPos    = {
      xLeft : 5,
      xRight: 605,
      yUpper: -25,
      yLower: 400,
      xStep : 100,
      yStep : 85
    },
    enemyNumber  = Math.floor(Math.random()*8 + 1 ),
    allEnemies = [];
    console.log(enemyNumber);

$("#score").html(theScore);
// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.getProfile();
};

Enemy.prototype.getProfile = function() {
  this.x = canvasPos.xLeft;
  this.y = canvasPos.yUpper + canvasPos.yStep * Math.floor(Math.random()*4 + 1);
  this.speed = Math.floor(Math.random()*300)+50;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x < canvasPos.xRight) {
      this.x += (this.speed * dt);
    } else {
      this.x = canvasPos.xLeft;
    }

    if(this.x < player.x + 30 && this.x + 60 > player.x && this.y < player.y + 60 && this.y + 40 > player.y) {
      // theScore = 0;
      // $("#score").html(theScore);
      player.reset();
      heart.decrease();
      // heart.reset();

    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};




// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';

  this.posInitialize();
}

Player.prototype.posInitialize = function() {
  this.x = canvasPos.xLeft + canvasPos.xStep*3;
  this.y = canvasPos.yLower;
}

Player.prototype.update = function() {
  if (this.y <= canvasPos.yUpper) {
    theScore++;
    $("#myScore").html(theScore);
    this.reset();
  }
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(direction) {
    if(direction == 'left' && this.x > canvasPos.xLeft) {
        this.x -= canvasPos.xStep;
    }
    if(direction == 'right' && this.x < canvasPos.xRight) {
        this.x += canvasPos.xStep;
    }
    if(direction == 'up' && this.y) {
        this.y -= canvasPos.yStep;
    }
    if(direction == 'down' && this.y < canvasPos.yLower) {
        this.y += canvasPos.yStep;
    }
};

Player.prototype.reset = function() {
  this.posInitialize();
}

// Chance to play
var Heart = function() {
  this.sprite = 'images/Heart.png';
  this.number = 5;
  // console.log(this.number);
}

Heart.prototype.render = function() {

  var imgObj = Resources.get(this.sprite);
  var posX = 640;

  for (var i=0 ; i<this.number; i++) {
    ctx.drawImage(imgObj, posX, -5, imgObj.width/3, imgObj.height/3);
    posX = posX - 40;
  }
}

Heart.prototype.decrease = function() {
  this.number--;
  if (this.number === 0){
    this.reset();
  }
}

// Heart.prototype.reset = function() {
//   this.number = 5;
// }



for (var i=0; i<enemyNumber; i++) {
  allEnemies.push(new Enemy());
}

var player = new Player();
var heart  = new Heart();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
