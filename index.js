const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 25;

canvas.height = tileSize * 22;
canvas.width = tileSize * 20;

const player = {
  x: canvas.width - tileSize,
  y: canvas.height - (tileSize*5),
  radius: tileSize/4,
  prevPos: {}
};

let animation;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

const map = [
  [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1],
  [1,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,0,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  
];

var tiles = [];
  for (var i = 0;i<map.length; i++){
    tiles[i] = [];
    for(var j=0; j <map[i].length; j++){
      tiles[i][j] = {x:0, y:0, type: ""};
    }
  };
  
function drawBoard(){
 ctx.fillStyle="#03011f"; 
 ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawMaze(){
  for (var i = 0;i<map.length; i++){
    for(var j=0; j <map[i].length; j++){
      let tileX = j * tileSize;
      let tileY = i * tileSize;
      tiles[i][j].x = tileX;
      tiles[i][j].y = tileY;
      if (map[i][j] === 1){
        tiles[i][j].type = "wall";
        drawWall(tileX, tileY);
      } else {
        drawEmpty(tileX,tileY);
      }
    }
  }
}

function drawWall(x,y){
  ctx.fillStyle = "#6cacc5";
  ctx.fillRect(x,y,tileSize,tileSize);
}

function drawEmpty(x, y){
  ctx.fillStyle = "#03011f";
  ctx.fillRect(x, y, tileSize, tileSize);
}

function drawPlayer(){
  ctx.beginPath();
  ctx.arc(player.x + tileSize/2,player.y+tileSize/2,player.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function updatePosition(){
  player.prevPos = {x: player.x, y: player.y};
  if (rightPressed){
    player.x += 2;
  }
  if (leftPressed){
    player.x -= 2;
  }
  if (upPressed){
    player.y -= 2;
  }
  if (downPressed){
    player.y += 2;
  }
}

function checkCollision(){
  if (player.x + tileSize > canvas.width){
    player.x = player.prevPos.x;
  }
  if (player.y + player.radius < 0){
    cancelAnimationFrame(animation);
    gameOver();
  }
  for(var i=0; i<map.length; i++) {
    for(var j=0; j<map[i].length; j++) {
      var b = tiles[i][j]; 
      if(player.x+player.radius * 3 > b.x && player.x < b.x + tileSize  - player.radius && player.y + tileSize > b.y + player.radius && player.y < b.y + tileSize - player.radius && b.type === "wall") {
          player.x = player.prevPos.x;
          player.y = player.prevPos.y;
      }
    }
  }
}

function gameOver(){
  canvas.style.visibility = "hidden";
  var win = document.querySelector(".win");
  win.style.visibility = "visible";
}

document.addEventListener("keydown", function(e){
  if(e.keyCode === 37){
    leftPressed = true;
  } else if (e.keyCode === 39){
    rightPressed = true;
  } else if (e.keyCode === 38){
    upPressed = true;
  } else if (e.keyCode === 40){
    downPressed = true;
  }
})

document.addEventListener("keyup", function(e){
  if(e.keyCode === 37){
    leftPressed = false;
  } else if (e.keyCode === 39){
    rightPressed = false;
  } else if (e.keyCode === 38){
    upPressed = false;
  } else if (e.keyCode === 40){
    downPressed = false;
  }
})

function update(){
  updatePosition();
  drawBoard();
  drawMaze();
  drawPlayer();
  checkCollision();
  animation = requestAnimationFrame(update);
}

animation = requestAnimationFrame(update);
