/*
-Basic functionality for pressing keys->playing sounds
-Key sounds will be shortened, slightly too long atm
-*/ 
let qwerty = "QWERASDFZXCV";//"QWERTYUIOPASDFGHJKLZXCVBNM";
let font,fontsize = 32;
//button struct
function button(color,letter,xpos,ypos){
    this.color = color;
    this.xpos = xpos;
    this.ypos = ypos;
    this.letter = letter;
    this.pressed = false
    this.flashTime = 0;
}
let buttons = [];//Array for buttons
let sounds = []; //Array to hold sounds
//audio file extension + path for sounds folder
const ext = ".wav";
const path = "./sounds";

//preload occurs before setup or draw, fill array with sounds
function preload(){
    soundFormats('wav');
    for(let i = 0;i < 6;i++){
        sounds[i] = loadSound(path+"/sound"+i+ext);
        if(i < 4){
            buttons.push(new button([255,0,0],qwerty[i],20+(i%4)*80,20))
        }
        else if(i < 8){
            buttons.push(new button([0,255,0],qwerty[i],20+(i%4)*80,100))
        }
    }
    font = loadFont("./ahronbd.ttf")
}

function setup() {
    let cnv = createCanvas(1000, 500);
    background(200);  
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
}

function draw(){
   background(200);
   for(let i = 0;i < buttons.length;i++){
       //highlights button when hovered over
       if(mouseX >= buttons[i].xpos && mouseX <= buttons[i].xpos+75 && mouseY >= buttons[i].ypos && mouseY <= buttons[i].ypos+75 && !buttons[i].pressed){
           buttons[i].color[2] = 255;
       }
       //sets highlight back to default unless its looping
       else if(!buttons[i].pressed){
           buttons[i].color[2] = 0;
       }
       //checks if button should be flashing and highlights if it is
       if(buttons[i].flashTime > 0){
           buttons[i].color[2] = 255;
           buttons[i].flashTime++;
           //resets flash time after 5 frames
           if(buttons[i].flashTime == 5){
               buttons[i].flashTime = 0;
           }
       }
       //draws button at index i
       fill(buttons[i].color);
       rect(buttons[i].xpos,buttons[i].ypos,75,75);
       fill(0)
       text(buttons[i].letter,buttons[i].xpos+35,buttons[i].ypos+35);
   }
}


function keyTyped(){
    //gets index of key pressed from qwerty sting and plays the sound
    let index = qwerty.indexOf(key.toUpperCase());
    sounds[index].play();
    buttons[index].flashTime=1;
}

function mousePressed(){
    for(let i = 0;i < buttons.length;i++){
        if(mouseX >= buttons[i].xpos && mouseX <= buttons[i].xpos+75 && mouseY >= buttons[i].ypos && mouseY <= buttons[i].ypos+75){
            //if a button is pressed already cut the loop
            if(buttons[i].pressed){
                buttons[i].color[2] = 0;
                buttons[i].pressed = false;
                sounds[i].stop();
            }
            //if a button is pressed loop the sound
            else{
                buttons[i].color[2] = 255;
                buttons[i].pressed = true;
                sounds[i].loop();
            }
            
        }
    }
}

