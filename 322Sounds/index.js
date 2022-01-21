/*
-Basic functionality for pressing keys->playing sounds
-Key sounds will be shortened, slightly too long atm
-*/
let qwerty = "QWERTYASDFGZXCV";//"QWERTYUIOPASDFGHJKLZXCVBNM";
let font, fontsize = 50;
let button_length = 100;
let counter = 0;
let stepCounter = 0;
let beats= [];
let forms = document.getElementById("forms");
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
    if(step <= 8) {
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
    }
    if(step <= 4) {
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
    }
    return {rhythm:rotateSeq(rhythm,offset),sound:sound,step:step,pulsesPerStep:pulsesPerStep,offset:offset};
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
        if (i < 6) {
            buttons.push(new button([255, i * 20, 0], qwerty[i], 350 + (i % 6) * button_length, 200))
        }

        else if (i < 11) {
            buttons.push(new button([i * 20, 255 - (i), 0], qwerty[i], 350 + (i % 6) * button_length, 300))
        }
        else if (i < 15) {
            buttons.push(new button([255, i * 15, 0], qwerty[i], 250 + (i % 5) * button_length, 400))
        }
    }
    font = loadFont("./ahronbd.ttf")
}

function setup() {
    let cnv = createCanvas(2200, 600);
    cnv.parent("canvas");
    background(206, 206, 206);
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);
}

function draw() {
    background(206, 206, 206);
    counter++;
    stroke(0);
    playSounds();
    drawButtons();
    drawRhythm();
}

function playSounds(){
    if(counter % 18 == 0){
        stepCounter++;
        for(let i = 0;i < beats.length;i++){
            let myBeat = beats[i];
            if(myBeat.rhythm[stepCounter%16]){
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

function drawRhythm() {
    updateBeats();
    let x = 1400;
    let y = 300;
    let layerSize = 100;
    let val = (beats.length+1)*layerSize;
    let start = 0;
    let end = 22.5;
    if(beats.length === 0){ //if no sounds are selected, default to step 16 on the innermost circle
        for (let i = 0; i <= 15; i++){ //i is which sector you're on
            if(stepCounter%16 == i)fill(0,0,0); //draw black every step
            else {
                if(i%2==0)fill(250-20);
                else fill(250-10);
            }
            arc(x, y, layerSize, layerSize, start + (22.5 * i), end + (22.5 * i));
        }
    }
    else{
        let layers = beats.length + 1; 
        for(let j = 0; j < layers; j++){ //j is which layer you're on
            for (let i = 0; i <= 15; i++){ //i is which sector you're on
                if((j == layers-1) && (stepCounter%16 == i))fill(0,0,0); //if we're on the innermost sector, draw black every step
                else if((j == layers-1)){
                    if(i%2==0)fill(250-20);
                    else fill(250-10);
                }
                else if((beats[j].rhythm[stepCounter%beats[j].step]) && (stepCounter%16 == i)) fill(buttons[beats[j].sound].color[0],buttons[beats[j].sound].color[1],buttons[beats[j].sound].color[2]); //assigns the color of the associated button to the segment
                else { //here we alternate between grey and lighter grey for segments
                    if(i%2==0)fill(250-20);
                    else fill(250-10);
                }
                arc(x, y, val-(layerSize * j), val-(layerSize * j), start + (22.5 * i), end + (22.5 * i));
            }
        }
    }
}

function makeForms(){
    document.getElementById("forms").innerHTML = "";
    for(let i = 0;i < beats.length;i++){
        let code = "<h2>Sound "+ qwerty[beats[i].sound]+ ":</h2> <form id='beat" + i + "'>";
        code += "<label for='steps"+ i +"'>Steps: </label>";
        code += "<input type='number' min='4' max='16' step='4' id='steps" + i + "'value='"+beats[i].rhythm.length + "'"+">";
        code += "<label for='pulses"+ i +"'>Pulses: </label>";
        code += "<input type='number' min='1' max='16' id='pulses" + i + "'value='"+beats[i].pulsesPerStep + "'"+">";
        code += "<label for='offset"+ i +"'>Offset: </label>";
        code += "<input type='number' min='0' max='16' id='offset" + i + "'value='"+beats[i].offset + "'"+">";
        code += "</form>";
        document.getElementById("forms").innerHTML += code;
    }
    
}

function getLargestStep(){
    var largest = 0;
    for(let i = 0; i < beats.length; i++){
        if (beats[i].step > largest) largest = beats[i].step;
    }
    return largest;
}

function updateBeats(){
    for(let i = 0;i < beats.length;i++){
        let step = parseInt(document.getElementById("steps"+i).value);
        //if(step == 12) step = 16;
        if(step == 12){
            if(beats[i].step == 8){
                step = 16;
                document.getElementById("steps"+i).value = 16;
            }
            else if(beats[i].step == 16){
                step = 8;
                document.getElementById("steps"+i).value = 8
            }
        }
        let pulses = parseInt(document.getElementById("pulses"+i).value);
        let offset = parseInt(document.getElementById("offset"+i).value);
        beats[i] = generateBeat(offset,beats[i].sound,step,pulses);
    }
}

function keyTyped() {
    //gets index of key pressed from qwerty sting and plays the sound
    let index = qwerty.indexOf(key.toUpperCase());
    sounds[index].play();
    buttons[index].flashTime = 1;
}

function mousePressed() {
    for (let i = 0; i < buttons.length; i++) {
        if (mouseX >= buttons[i].xpos && mouseX <= buttons[i].xpos + button_length && mouseY >= buttons[i].ypos && mouseY <= buttons[i].ypos + button_length) {
            //if a button is pressed already cut the loop
            if (buttons[i].pressed) {
                buttons[i].color[2] = 0;
                buttons[i].clicked = false;
                buttons[i].pressed = false;
                for(let j = 0;j < beats.length;j++){
                    if(i == beats[j].sound){
                        console.log(beats.splice(j,1));
                        makeForms();
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
                if(beats.length < 5){
                    buttons[i].color[2] = 255;
                    buttons[i].clicked = true;
                    buttons[i].pressed = true;
                    beats.push(generateBeat(i%8,i,8,3));
                    makeForms();
                }
            }

        }
    }
}