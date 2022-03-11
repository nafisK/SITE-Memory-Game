// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const maxLives = 2;

// Global Variables
var pattern = [];
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var numStrikes = 0;

// Audio Initializers
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
var x;
var time = 10;

function startGane() {
  // Initialize game variables
  setPattern();
  progress = 0;
  numStrikes = 0;
  gamePlaying = true;


  // Swap the start and stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  clearPattern();
  stopTimer();
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  clueHoldTime -= 100;
  console.log(clueHoldTime);
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  console.log("Delay at play:" + delay);
  setTimeout(startTimer(), (delay+= clueHoldTime+ cluePauseTime));
}

function loseGame(){
  stopGame();
  stopTimer();
  clearPattern();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn){
  if(!gamePlaying){
    return;
  }
 if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    if (numStrikes >= maxLives) {
      loseGame();
    }
    else {
      console.log("Numstrickes: " + numStrikes);
      numStrikes++;
      alert("You have " + (maxLives - numStrikes + 1) + " chances remaining.");
      playClueSequence();
    }
  }
  
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function setPattern() {
  for (var i = 0 ; i < 8; i ++){
    pattern.push(1 + getRandomInt(8))
  }
}

function clearPattern() {
  pattern = [];
}


// Sound Synthesis Functions
const freqMap = {
  1: 440.000,
  2: 493.883,
  3: 523.251,
  4: 587.330,
  5: 659.255,
  6: 698.457,
  7: 783.991,
  8: 880.000
}

function playTone(btn,len){ 
  console.log("btn: ", btn, "How Long: ", len)
  context.resume()
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05, 0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  }, len)
}

function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
    tonePlaying = false
}



function startTimer(){
  clearInterval(x);
  time = 10;
  x = setInterval(function(){
  document.getElementById("timer").innerHTML= "Time Remaining: " + time + " seconds";
  time--;
  if (time <= 0 ){
    clearInterval(x);
    loseGame();
  }
},1200);
}

function stopTimer(){
  clearInterval(x);
  time = 10;
  document.getElementById("timer").innerHTML= "Time Remaining: " + time + " seconds";
}
