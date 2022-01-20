/*
-Basic functionality for pressing keys->playing sounds
-Key sounds will be shortened, slightly too long atm
-*/
let qwerty = "QWERTYASDFGZXCV";//"QWERTYUIOPASDFGHJKLZXCVBNM";
let font, fontsize = 50;
let button_length = 100;
let counter = 0;
let stepCounter = 0;
let beats = [];
//let beats= [generateBeat(1,2,8,3),generateBeat(0,7,8,3),generateBeat(1,13,8,5),generateBeat(1,11,8,5)];
function generateBeat(offset,sound,step,pulsesPerStep){
    let bucket = 0;
    let rhythm = [];
    for(let i = 0;i < step;i++){
        bucket += pulsesPerStep;
        if(bucket >= step){
            bucket = bucket - step;
            rhythm.push(true);
        }
        else{
            rhythm.push(false);
        }
    }
    return {rhythm:rotateSeq(rhythm,offset),sound:sound,step:step};
}

function rotateSeq(seq, rotate){
    var output = new Array(seq.length); //new array to store shifted rhythm
    var val = seq.length - rotate;

    for( var i=0; i < seq.length ; i++){
        output[i] = seq[ Math.abs( (i+val) % seq.length) ];
    }

    return output;
}
//button struct
function button(color, letter, xpos, ypos) {
    this.color = color;
    this.xpos = xpos;
    this.ypos = ypos;
    this.letter = letter;
    this.pressed = false
    this.clicked = false
    this.flashTime = 0;
    this.interval = 50;
}
let buttons = [];//Array for buttons
let sounds = []; //Array to hold sounds
let bar = [];
let savedBar = [];
let savedButtons = [];
let openMenu = false;

//audio file extension + path for sounds folder
const ext = ".wav";
const path = "./sounds";

function initializeBar() {
    for (let i = 0; i < 288; i++) {
        bar.push(-1);
    }
}

//preload occurs before setup or draw, fill array with sounds
function preload() {
    soundFormats('wav');
    initializeBar();
    for (let i = 0; i < 15; i++) {
        sounds[i] = loadSound(path + "/sound" + i + ext);
        console.log(sounds[i]);
        if (i < 6) {
            buttons.push(new button([255, i * 20, 0], qwerty[i], 500 + (i % 6) * button_length, 250))
        }

        else if (i < 11) {
            buttons.push(new button([i * 20, 255 - (i), 0], qwerty[i], 500 + (i % 6) * button_length, 350))
        }
        else if (i < 15) {
            buttons.push(new button([255, i * 15, 0], qwerty[i], 400 + (i % 5) * button_length, 450))
        }
    }
    font = loadFont("./ahronbd.ttf")
}

function setup() {
    let cnv = createCanvas(2200, 1300);
    background(255);
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);
}

function draw() {
    background(255);
    counter++;
    stroke(0);
    playSounds();
    drawButtons();
    drawSoundBar();
    drawRhythm();
}

function playSounds(){
    if(counter % 18 == 0){
        stepCounter++;
        for(let i = 0;i < beats.length;i++){
            let myBeat = beats[i];
            console.log(myBeat.rhythm);
            if(myBeat.rhythm[stepCounter%myBeat.step]){
                sounds[myBeat.sound].play();
            }
        }
    }
    if (counter == 288) counter = 0;
    if (bar[counter] >= 0) {
        sounds[bar[counter]].play();
    }
}

function drawButtons(){
    for (let i = 0; i < buttons.length; i++) {
        //highlights button when hovered over
        if (mouseX >= buttons[i].xpos && mouseX <= buttons[i].xpos + button_length && mouseY >= buttons[i].ypos && mouseY <= buttons[i].ypos + button_length && !buttons[i].pressed) {
            buttons[i].color[2] = 255;
        }
        //sets highlight back to default unless its looping
        else if (!buttons[i].pressed) {
            buttons[i].color[2] = 0;
        }
        //checks if button should be flashing and highlights if it is
        if (buttons[i].flashTime > 0) {
            buttons[i].color[2] = 255;
            buttons[i].flashTime++;
            //resets flash time after 5 frames
            if (buttons[i].flashTime == 5) {
                buttons[i].flashTime = 0;
            }
        }
        //draws button at index i
        fill(buttons[i].color);
        rect(buttons[i].xpos, buttons[i].ypos, button_length, button_length, 15);
        fill(0)
        text(buttons[i].letter, buttons[i].xpos + 50, buttons[i].ypos + 50);
    }
}

function drawSoundBar(){
    fill(200);
    rect(600, 600, 298, 100);
    fill(0);
    rect(600 + counter, 600, 10, 100);
    for (let i = 0; i < 288; i++) {
        if (bar[i] >= 0) {
            if(beats)fill(buttons[bar[i]].color);
            rect(600 + i, 600, 10, 100);
        }
    }
}

function drawRhythm() {
    let x = 1650;
    let y = 450;
    let val = (beats.length+1)*150;
    let start = 0;
    let end = 22.5;
    if(beats.length === 0){ //if no sounds are selected, default to step 16 on the innermost circle
        for (let i = 0; i <= 15; i++){ //i is which sector you're on
            if(stepCounter%16 == i)fill(0,0,0); //draw black every step
            else {
                console.log("here");
                if(i%2==0)fill(250-20);
                else fill(250-10);
            }
            arc(x, y, 150, 150, start + (22.5 * i), end + (22.5 * i));
        }
    }
    else{
        let layers = beats.length + 1; 
        for(let j = 0; j < layers; j++){ //j is which layer you're on
            for (let i = 0; i <= 15; i++){ //i is which sector you're on
                if((j == layers-1) && (stepCounter%beats[0].step == i))fill(0,0,0); //if we're on the innermost sector, draw black every step
                else if((j == layers-1)){
                    if(i%2==0)fill(250-20);
                    else fill(250-10);
                }
                else if((beats[j].rhythm[stepCounter%beats[j].step]) && (stepCounter%beats[j].step == i)) fill(buttons[beats[j].sound].color[0],buttons[beats[j].sound].color[1],buttons[beats[j].sound].color[2]); //assigns the color of the associated button to the segment
                else { //here we alternate between grey and lighter grey for segments
                    if(i%2==0)fill(250-20);
                    else fill(250-10);
                }
                arc(x, y, val-(150 * j), val-(150 * j), start + (22.5 * i), end + (22.5 * i));
            }
        }
    }
}


function clearBar() {
    console.log("cleared: " + bar);
    for (let i = 0; i < bar.length; i++) {
        if (bar[i] != -1) {
            buttons[bar[i]].pressed = false
        }
        bar[i] = -1;
    }
}

function saveBar() {
    savedBar.push(bar.slice(0));
    //savedButtons.push(buttons.slice(0));
    console.log("saved: " + savedButtons[0]);
}

function loadBar() {
    console.log("loading: " + savedBar[0]);
    bar = savedBar[0].slice(0);
    //buttons = savedButtons[0].slice(0);
    for (let i = 0; i < bar.length; i++) {
        if (bar[i] != -1) {
            buttons[bar[i]].color[2] = 255;
            if(buttons[bar[i]].clicked == true)buttons[bar[i]].pressed = true;
        }
    }
}

function keyTyped() {
    //gets index of key pressed from qwerty sting and plays the sound
    let index = qwerty.indexOf(key.toUpperCase());
    sounds[index].play();
    buttons[index].flashTime = 1;
    bar[counter] = index;
}

function keyPressed() {
    if (keyCode === BACKSPACE) {
        clearBar()
    }
    else if (keyCode === ENTER) {
        saveBar()
    }
    else if (keyCode === SHIFT) {
        //openMenu = !openMenu
        //displayMenu()
        loadBar()
    }
}

function mousePressed() {
    for (let i = 0; i < buttons.length; i++) {
        if (mouseX >= buttons[i].xpos && mouseX <= buttons[i].xpos + button_length && mouseY >= buttons[i].ypos && mouseY <= buttons[i].ypos + button_length) {
            //if a button is pressed already cut the loop
            if (buttons[i].pressed) {
                buttons[i].color[2] = 0;
                buttons[i].clicked = false;
                buttons[i].pressed = false;
                //sounds[i].stop();
                for(let j = 0;j < beats.length;j++){
                    if(i == beats[j].sound){
                        console.log(beats.splice(j,1));
                    }
                }
                for (let j = 0; j < bar.length; j++) {
                    if (bar[j] == i) {
                        bar[j] = -1;
                    }
                }
            }
            //if a button is clicked loop the sound
            else {
                buttons[i].color[2] = 255;
                buttons[i].clicked = true;
                buttons[i].pressed = true;
                //sounds[i].loop();
                beats.push(generateBeat(i%8,i,8,3))
                //sounds[i].play();
                // for (let j = counter; j < bar.length; j += buttons[i].interval) {
                //     bar[j] = i;
                // }
            }

        }
    }
}