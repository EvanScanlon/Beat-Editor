/*
-Basic functionality for pressing keys->playing sounds
-Key sounds will be shortened, slightly too long atm
-*/ 
let qwerty = "QWERTYUIOPASDFGHJKLZXCVBNM";
let font,fontsize = 32;
function button(color,letter,xpos,ypos){
    this.color = color;
    this.xpos = xpos;
    this.ypos = ypos;
    this.letter = letter;
}
let buttons = [];
//buttons.push(new button([255,0,0],20,20));
//console.log(buttons[0]);
//Arrays to hold drum + key sounds
let drums = [];
let keys = [];
//audio file extension + path for sounds folder
const ext = ".wav";
const path = "./sounds";

//preload occurs before setup or draw, fill arrays with sounds
function preload(){
    soundFormats('wav');
    for(let i = 0; i < 4; i++){
        drums[i] = loadSound(path+'/perc/perc'+i+ext);
        buttons.push(new button([255,0,0],qwerty[i],20+i*80,20))
    }
    for(let i = 0; i < 2; i++){
        keys[i] = loadSound(path+'/keys/keys'+i+ext);
        buttons.push(new button([0,255,0],qwerty[i+10],20+i*80,100))
    }
    font = loadFont("./ahronbd.ttf")
}

function setup() {
    let cnv = createCanvas(500, 450);
    background(200);  
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
}

function draw(){
   background(200);
   for(let i = 0;i < buttons.length;i++){
       fill(buttons[i].color);
       rect(buttons[i].xpos,buttons[i].ypos,75,75);
       fill(0)
       text(buttons[i].letter,buttons[i].xpos+35,buttons[i].ypos+35);
   }
}


function keyTyped(){
    let index = qwerty.indexOf(key.toUpperCase());
    if(index < 10){
        drums[index].play();
    }
    else if(index < 19){
        keys[index-10].play();
    }
}

