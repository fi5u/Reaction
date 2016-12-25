var gameOn = false;
var leds = [LED1, LED2, LED3];
var fastestTime;
var reactionStartTime;
var reactionStopTime;

function turnLightsOff() {
  digitalWrite(leds, 0);
}

function turnGameOn() {
  gameOn = true;
  flashLights();
  console.log(fastestTime ? 'Current fastest time: ' + fastestTime.toFixed(2) : 'No fastest time yet');

  setTimeout(function() {
    startRandomCountdown();
  }, 1000);
}

function startRandomCountdown() {
  var randomTime = Math.round(Math.random() * 12000);
  setTimeout(function() {
    if(!gameOn) { return; }
    flashLight(LED3);
  }, randomTime);
}

function flashLights() {
  var ledIndex = 0;
  var flashInterval = setInterval(function() {
    turnLightsOff();
    digitalWrite(leds[ledIndex], 1);
    ledIndex++;
    if(ledIndex >= leds.length) {
      turnLightsOff();
      clearInterval(flashInterval);
    }
  }, 200);
}

function flashLight(led) {
  digitalWrite(led, 1);
  startReactionTime();
  setTimeout(function() {
    digitalWrite(led, 0);
  }, 50);
}

function startReactionTime() {
  reactionStartTime = new Date();
}

function endFlash(led, duration, times) {
  var ledIndex = 0;
  var flashTimeout = setInterval(function() {
    var ledValue = ledIndex % 2 === 0 ? 0 : 1;
    digitalWrite(led, ledValue);
    ledIndex++;
    if(ledIndex > times) {
      clearInterval(flashTimeout);
    }
  }, duration);
}

function endGame() {
  gameOn = false;
}

setWatch(function() {
  var reactionTime;
  if(!gameOn) {
    turnGameOn();
  }
  else {
    reactionStopTime = new Date();
    reactionTime = reactionStopTime - reactionStartTime;
    if(!fastestTime || reactionTime < fastestTime) {
      setTimeout(function() {
        console.log('New fastest time: ' + reactionTime.toFixed(2));
        endFlash(LED2, 200, 12);
        fastestTime = reactionTime;
        endGame();
      }, 100);
    }
    else {
      console.log('Lost');
      endFlash(LED1, 20, 10);
      endGame();
    }
  }
}, BTN, {edge:"rising", debounce:50, repeat:true});