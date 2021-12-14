/*
-Basic functionality for pressing keys->playing sounds
-Key sounds will be shortened, slightly too long atm
-*/ 
let qwerty = "QWERASDFZXCV";//"QWERTYUIOPASDFGHJKLZXCVBNM";
let font,fontsize = 50;
let button_length = 100;
let counter = 0;
//button struct
function button(color,letter,xpos,ypos){
    this.color = color;
    this.xpos = xpos;
    this.ypos = ypos;
    this.letter = letter;
    this.pressed = false
    this.flashTime = 0;
    this.interval = 50;
}
let buttons = [];//Array for buttons
let sounds = []; //Array to hold sounds
let bar = [];
let savedBar = [];
let openMenu = false;

//audio file extension + path for sounds folder
const ext = ".wav";
const path = "./sounds";

function initializeBar(){
    for(let i = 0;i < 600;i++){
        bar.push(-1);
    }
}

//preload occurs before setup or draw, fill array with sounds
function preload(){
    soundFormats('wav');
    initializeBar();
    for(let i = 0;i < 6;i++){
        sounds[i] = loadSound(path+"/sound"+i+ext);
        if(i < 4){
            buttons.push(new button([255-(i%4)*40,0,0],qwerty[i],500+(i%4)*button_length,250))
        }
        else if(i < 8){
            buttons.push(new button([0,255-(i%4)*40,0],qwerty[i],500+(i%4)*button_length,350))
        }
    }
    font = loadFont("./ahronbd.ttf")
}

function setup() {
    let cnv = createCanvas(10000, 10000);
    background(255);  
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
}

function draw(){ 
    background(255);
    counter++;
    stroke(0);
    if(counter == 600) counter = 0;
    if(bar[counter] >= 0){
        console.log(bar[counter]);
        sounds[bar[counter]].play();
    }
    for(let i = 0;i < buttons.length;i++){
       //highlights button when hovered over
       if(mouseX >= buttons[i].xpos && mouseX <= buttons[i].xpos+button_length && mouseY >= buttons[i].ypos && mouseY <= buttons[i].ypos+button_length && !buttons[i].pressed){
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
       rect(buttons[i].xpos,buttons[i].ypos,button_length,button_length,15);
       fill(0)
       text(buttons[i].letter,buttons[i].xpos+50,buttons[i].ypos+50);
   }
   
    fill(200);
    rect(400,500,610,100);
    fill(0);
    rect(400+counter,500,10,100);
    for(let i = 0;i < 600;i++){
        if(bar[i] >= 0){
        fill(buttons[bar[i]].color);
        rect(400+i,500,10,100);
        }
    }
    if(openMenu){
        displayMenu()
    }
}

function clearBar(){
    console.log("cleared: " + bar);
    for (let i = 0; i < bar.length; i++) {
        if(bar[i] != -1){
            buttons[bar[i]].pressed = false
        }
        bar[i] = -1;
    }
}

function saveBar(){ 
    savedBar.push(bar.slice(0));
    console.log("saved: " + savedBar)
}

function displayMenu(){
    for(let i = 0; i < savedBar.length; i++){
        //create an option for each saved bar
    }
}

function loadBar(){
    console.log("loading: " + savedBar[0]);
    bar = savedBar[0].slice(0);
    for(let i = 0;i < bar.length;i++){
        if(bar[i] != -1){
            buttons[bar[i]].color[2] = 255;
        }
    }
}

function keyTyped(){
    //gets index of key pressed from qwerty sting and plays the sound
    let index = qwerty.indexOf(key.toUpperCase());
    sounds[index].play();
    buttons[index].flashTime=1;
    bar[counter] = index;
}

function keyPressed() {
    if (keyCode === BACKSPACE){
        clearBar()
    }
    else if (keyCode === ENTER){
        saveBar()
    }
    else if (keyCode === SHIFT){
        //openMenu = !openMenu
        //displayMenu()
        loadBar()
    }
  }

function mousePressed(){
    for(let i = 0;i < buttons.length;i++){
        if(mouseX >= buttons[i].xpos && mouseX <= buttons[i].xpos+button_length && mouseY >= buttons[i].ypos && mouseY <= buttons[i].ypos+button_length){
            //if a button is pressed already cut the loop
            if(buttons[i].pressed){
                buttons[i].color[2] = 0;
                buttons[i].pressed = false;
                //sounds[i].stop();
                for(let j = 0;j < bar.length;j++){
                    if(bar[j] == i){
                        bar[j] = -1;
                    } 
                }
            }
            //if a button is pressed loop the sound
            else{
                buttons[i].color[2] = 255;
                buttons[i].pressed = true;
                //sounds[i].loop();
                sounds[i].play();
                for(let j = counter;j < bar.length;j+= buttons[i].interval){
                    bar[j] = i;
                }
            }
            
        }
    }
}