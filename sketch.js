var trex ,trex_running, trex_collide;
var edges;
var ground, invisibleGround;
var groundImage;
var cloud, cloudImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var obstaclesGroup, cloudsGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg, restartImg, gameOver, restart;
var jumpSound, checkpointSound, dieSound;

  function preload(){
      trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
      groundImage = loadImage("ground2.png");
      cloudImage = loadImage("cloud.png");
      trex_collide = loadAnimation("trex_collided.png");
      gameOverImg = loadImage("gameOver.png");
      restartImg = loadImage("restart.png");
      obstacle1 = loadImage("obstacle1.png");
      obstacle2 = loadImage("obstacle2.png");
      obstacle3 = loadImage("obstacle3.png");
      obstacle4 = loadImage("obstacle4.png");
      obstacle5 = loadImage("obstacle5.png");
      obstacle6 = loadImage("obstacle6.png");
      
      jumpSound =  loadSound("jump.mp3");
      checkpointSound = loadSound ("checkpoint.mp3");
      dieSound = loadSound("die.mp3");
  }

  function setup(){
    createCanvas(windowWidth, windowHeight);
    
    //crear sprite del t-rex.
    trex = createSprite(50, height -190, 20, 50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collide);
    trex.scale = 0.6;
    trex.setCollider("circle", 13, 0, 40);
    //trex.debug = true;

    //creacion del suelo
    ground = createSprite(width/2,height -80,400,20);
    ground.addImage("ground", groundImage);

    //crear un sprite invisible
    invisibleGround = createSprite(width/2,height -10,width,125);
    invisibleGround.visible = false;

    //variable que guarda los bordes
    edges = createEdgeSprites();

    /*var rand = Math.round(random(1,100));
    console.log(rand);*/

    gameOver = createSprite(width/2, height/2 -50,100);
    gameOver.addImage("gameOver", gameOverImg);
    gameOver.scale = 0.7;

    restart = createSprite(width/2, height/2);
    restart.addImage("restart", restartImg);
    restart.scale = 0.6;

    obstaclesGroup = new Group();
    cloudsGroup = new Group();
   
  }

function draw(){
  
    
  background("white");
  

  //console.log(frameCount);

  //texto para la puntuaci??n
  fill("black");
  text("Puntuaci??n: " + score, width/2, 50);


  if(gameState == PLAY){
    //visibilidad de los gameovers
    gameOver.visible = false;
    restart.visible = false;
  //Suelo moviendose
  ground.velocityX = -(7 + score/200);

  //generar la puntuaci??n
  score = score + Math.round(getFrameRate() / 60.44);
  if(score > 0 && score % 100 ==0){
    checkpointSound.play();
  }

  if(ground.x<0){
    ground.x = ground.width/2; 
  }

  //salto del trex
  if((touches.length > 0 || keyDown("space")) && trex.y >= height - 180 ){
    jumpSound.play();
      trex.velocityY = -10;
      touches = []
  }
  //agregando gravedad al dino
  trex.velocityY = trex.velocityY + 0.5

    //aparece las nubes y obstaculos
    spawnClouds();
    spawnObstacles();

  if(obstaclesGroup.isTouching(trex)){
    dieSound.play();
    gameState = END;
   

  }

  }
  else if(gameState == END){
    ground.velocityX = 0;
   //cambio de animaci??n
   trex.changeAnimation("collided", trex_collide);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //ciclo de vida para los obstaculos 
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    //fin del movimiento del trex
    trex.velocityY = 0; 

    //visibilidad de los gameovers en "true"
    gameOver.visible = true;
    restart.visible = true;


  //funcionabilidad del restart
  if (keyDown("space")){
    gameState == PLAY ;
  }

  /*if(mousePressedOver(restart)){
    
      }
  }*/
  if(touches.length > 0 || mousePressedOver(restart)){
    reset();
    touches = [];
  }
}

  


  trex.collide(invisibleGround);  

  drawSprites();

}

function spawnClouds(){
  if(frameCount % 60 == 0){
    cloud = createSprite(width +20, height, 40, 10);
    cloud.velocityX = -3;
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.y = Math.round(random(10,95));

    //console.log(trex.depth);
    //console.log(cloud.depth);

    //ajuste de profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //asignar un ciclo de vida a la variable
    cloud.lifetime = 220;

    //a??adir cada nube en el grupo
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    obstacle = createSprite (width +20, height -95, 50, 10);
    obstacle.velocityX = -(7 + score / 200);

    //generar obstaculos al azar
    var rand = Math.round(random(1,6));
    switch (rand){
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
      default: break;
    }

    //asignar escala y ciclo de vida
    obstacle.scale = 0.5 ;
    obstacle.lifetime = 220;

        //a??adir cada obstaculo en el grupo
        obstaclesGroup.add(obstacle);
  }
  
}
function reset(){
  gameState = PLAY;
  score = 0;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running");
  
    }