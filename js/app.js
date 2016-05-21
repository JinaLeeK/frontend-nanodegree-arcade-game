var theScore     = 0,
    canvasPos    = {
      xLeft : 5,
      xRight: 605,
      yUpper: -25,
      yLower: 400,
      xStep : 100,
      yStep : 85
    },
    levelBtn = $("input:radio"),
    allEnemies = [],
    enemyNum,
    isGameOver = false,
    currentLevel = localStorage.getItem("level") || $("input:checked").val();

var soundData = {
  plusScore: new Howl({
    urls: ['sounds/bubbles.mp3']
  }),
  minusHeart: new Howl({
    urls:['sounds/flash-2.mp3']
  })
};



// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.getProfile();
};

Enemy.prototype.getProfile = function() {
  this.x = canvasPos.xLeft;
  this.y = canvasPos.yUpper + canvasPos.yStep * Math.floor(Math.random()*4 + 1);
  this.speed = Math.floor(Math.random()*300)+50;
};

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
      player.reset();
      soundData.minusHeart.play();
      heart.decrease();
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
    soundData.plusScore.play();
    theScore++;
    $("#score").html(theScore);
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
}

Heart.prototype.render = function() {

  var imgObj = Resources.get(this.sprite);
  var posX = 640;

  for (var i=0 ; i<this.number; i++) {
    ctx.drawImage(imgObj, posX, -12, imgObj.width/3, imgObj.height/3);
    posX = posX - 40;
  }
}

Heart.prototype.decrease = function() {
  this.number--;
  if (this.number === 0){
      this.gameOver();
  }
}

Heart.prototype.reset = function() {
  this.number = 5;
}

Heart.prototype.gameOver = function() {
  $("#game-over-overlay").css("display", "block");
  $("#game-over").css("display", "block");
  localStorage.setItem("level", $("input:checked").val());
  // $("#game-over").css("diplay", "block");
  isGameOver = true;

}


var levelToNum = function(str) {
  if (str === 'option1') {
    return Math.floor(Math.random()*2 + 1)
  } else if (str === 'option2') {
    return  Math.floor(Math.random()*3 + 1) + 2;
  } else if (str === 'option3') {
    return  Math.floor(Math.random()*3 + 1) + 5
  }
}

var curLevel = function(str) {
  if (str === 'option1') {
    $("input:radio:nth(0)").attr("checked", true);
  } else if (str === 'option2') {
    $("input:radio:nth(1)").attr("checked", true);
  } else {
    $("input:radio:nth(2)").attr("checked", true);
  }
};

curLevel(currentLevel);
enemyNum = levelToNum(currentLevel);
// enemyNum = levelToNum($("input:checked").val());
for (var i=0; i<enemyNum; i++) {
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
    $()
    player.handleInput(allowedKeys[e.keyCode]);
});


levelBtn.change(function() {
  // console.log($("input:radio").val());
  enemyNum = levelToNum($("input:checked").val());
  allEnemies = [];
  $("input:radio").blur();
  for (var i=0; i<enemyNum; i++) {
    allEnemies.push(new Enemy());
  }
  player.reset();
  heart.reset();
});
