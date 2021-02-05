var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided, mario_walk;
var ground, invisibleGround, groundImage;
var backgroundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running =   loadAnimation("s.gif");
  mario_collided = loadAnimation("images/marioUp.png"); 
  
  groundImage = loadImage("images/ground.png");
  backgroundImage = loadImage("images/un2.jpg");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/ms.png");
  obstacle2 = loadImage("images/ns.png");
  obstacle3 = loadImage("images/ks.png");
  
  gameOverImg = loadImage("images/gameOverText1.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(displayWidth - 20, displayHeight-120);
  
  mario = createSprite(100,180,20,50);
  
  mario.addAnimation("running", mario_running);

  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.15;
  
  ground = createSprite(200,180,700,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,5);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  textSize(18);
  textStyle(BOLD);
  fill("white");
  score = 0;
}

function draw() {
  
  camera.x = mario.x;
  camera.y = mario.y;

  gameOver.position.x = restart.position.x = camera.x
  background(backgroundImage);
  textAlign(RIGHT, TOP);
  text("Score: "+ score, 500,5);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  if(keyDown("space") && mario.y >= 90) {
      mario.velocityY = -17;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/3;
    }
  
    mario.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    mario.changeAnimation("collided",mario_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 300;
    
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,165,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }           
    obstacle.scale = 0.2
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
