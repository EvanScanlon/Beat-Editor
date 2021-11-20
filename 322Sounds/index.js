/*
-Basic functionality for pressing keys->playing sounds
-Key sounds will be shortened, slightly too long atm
-*/ 


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
    }
    for(let i = 0; i < 2; i++){
        keys[i] = loadSound(path+'/keys/keys'+i+ext);
    }
}

function setup() {
    let cnv = createCanvas(500, 450);
    background(200);  
}

function draw(){
   
}


function keyTyped(){
    switch(key){
        case 'a':
            drums[1].play();
            break;
        case 'd':
            drums[0].play();
            break;
        case 't':
            drums[2].play();
            break;
        case 'u':
            drums[3].play();
            break;
        case 's':
            keys[0].play();
            break;
        case 'f':
            keys[1].play();
            break;
        default:
            break;
    }
}

