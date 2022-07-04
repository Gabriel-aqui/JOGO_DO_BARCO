const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var cannonBall;
var matriz = []
var shipMatriz = []
var ship
var boatAnimation = [];
var boatJSON, boatIMG;
var brokenBoatAnimation = [];
var brokenBoatJSON, brokenBoatIMG;
var waterSplashAnimation = [];
var waterSplashJSON, waterSplashIMG;
var fimJogo = false
var pirateLaugh = false
var laughSound, backSound, shootSound, splashSound
var score = 0

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatJSON = loadJSON("assets/boat/boat.json");
  boatIMG = loadImage("assets/boat/boat.png");
  brokenBoatJSON = loadJSON("assets/boat/broken_boat.json");
  brokenBoatIMG = loadImage("assets/boat/broken_boat.png");
  waterSplashJSON = loadJSON("assets/water_splash/water_splash.json");
  waterSplashIMG = loadImage("assets/water_splash/water_splash.png");
  laughSound = loadSound("assets/pirate_laugh.mp3")
  backSound = loadSound("assets/background_music.mp3")
  shootSound = loadSound("assets/cannon_explosion.mp3")
  splashSound = loadSound("assets/cannon_water.mp3")
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, {
    isStatic: true
  });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, {
    isStatic: true
  });
  World.add(world, tower);
  cannon = new Cannon(180, 110, 130, 100, angle);
  
  var boatFrames = boatJSON.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatIMG.get(pos.x, pos.y, pos.w, pos.h)
    boatAnimation.push(img)
  }




  var brokenBoatFrames = brokenBoatJSON.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatIMG.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = waterSplashJSON.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashIMG.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);
  
  if(!backSound.isPlaying()) {
  backSound.play()
  backSound.setVolume(0.1)
  }

  Engine.update(engine);

  push();
  fill("brown");
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width * 2, 1);
  pop();

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  for (var i = 0; i < matriz.length; i++) {
    showCb(matriz[i], i)
    collision(i)
  }

  cannon.display();
  shipFunction()
  //Exibir pontuação 
  fill("#6d4c41"); 
  textSize(40); 
  text(`Pontuação: ${score}`, width - 200, 50);
   //text("Pontuação: "+score, width - 200, 50); 
  textAlign(CENTER, CENTER);
}


function keyReleased() {
  if (keyCode === 32) {
    matriz[matriz.length - 1].shoot();
    shootSound.play()
    shootSound.setVolume(0.3)
  }
}

function keyPressed() {
  if (keyCode === 32) {
    cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = []
    Matter.Body.setAngle(cannonBall.body, cannon.angle)
    matriz.push(cannonBall)
  }
}

function showCb(CannonBall, index) {
  if (CannonBall) {
    cannonBall.display();
    cannonBall.animate()
    if(CannonBall.body.position.x >= width || CannonBall.body.position.y >= height - 50) {
      if(!CannonBall.sink) {
        splashSound.play()
        splashSound.setVolume(0.2)
        CannonBall.remove(index)
      }
      
    }
  }
}

function shipFunction() {
  if (shipMatriz.length > 0) {
    if (shipMatriz[shipMatriz.length - 1] === undefined || shipMatriz[shipMatriz.length - 1].body.position.x < width - 300) {
      var positions = [-30, -40, -23, -50]
      var position = random(positions)
      ship = new Barco(width - 80, height - 60, 170, 170, position, boatAnimation)
      shipMatriz.push(ship)
    }
    for (var i = 0; i < shipMatriz.length; i++) {
      if (shipMatriz[i]) {
      Matter.Body.setVelocity(shipMatriz[i].body, {
        x: -1,
        y: 0
      })
      shipMatriz[i].display()
      shipMatriz[i].animate()
      var endGame = Matter.SAT.collides(this.tower, shipMatriz[i].body)
      if(endGame.collided && !shipMatriz[i].broken) {
        if(!pirateLaugh && !laughSound.isPlaying()){
        laughSound.play()
        pirateLaugh = true
        }
        fimJogo = true
        gameOver()
      }
    } else {
      shipMatriz[i]
    }
  }
  } else {
    ship = new Barco(width - 80, height - 60, 170, 170, -60, boatAnimation)
    shipMatriz.push(ship)
  }
}

function collision(index) {
  for (var i = 0; i < shipMatriz.length; i++) {
    if (matriz[index] !== undefined && shipMatriz[i] !== undefined) {
      var ballCollision = Matter.SAT.collides(matriz[index].body, shipMatriz[i].body)
      if (ballCollision.collided) {
        score += 5 
        shipMatriz[i].remove(i)
        World.remove(world, matriz[index].body)
        delete matriz[index]
      }
    }
  }
}

function gameOver() {
  swal({
      title: `Fim de Jogo!!!`,
      text: "Obrigado player anonimo",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}