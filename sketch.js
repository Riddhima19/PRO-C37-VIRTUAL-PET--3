//m
var dog,sadDog,happyDog, garden,washroom,database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState, readState;

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
garden=loadImage("images/virtual+pet+images (1)/virtual pet images/Garden.png")
bedroom=loadImage("images/virtual+pet+images (1)/virtual pet images/Bed Room.png")
washroom=loadImage("images/virtual+pet+images (1)/virtual pet images/Wash Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.2 ;
  
  feed=createButton("Feed the dog");
  feed.position(700,120);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,120);
  addFood.mousePressed(addFoods);
  
}

function draw() {
background("green")
  currentTime=hour();

  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }
   
   else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
    }

   else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }
   
   else{
    update("Hungry")
    foodObj.display();
   }


   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  
  else{
   feed.show();
   addFood.show();
  }
 
 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({

    Food:foodObj.getFoodStock(),
    FeedTime:hour()
 //   gameState:"Hungry"

  })
}
          
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS 
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
