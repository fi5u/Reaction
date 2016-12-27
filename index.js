const leds = [LED1, LED2, LED3]
let gameOn = false
let fastestTime
let reactionStartTime

function turnLightsOff() {
    digitalWrite(leds, 0)
}

function turnGameOn() {
    setTimeout(() => {
        // Ensure we're not trying to reset the game
        if(digitalRead(BTN) === 1) { return }
        gameOn = true
        led(leds, 1, 100, 20)
        console.log(fastestTime ? `Current fastest time: ${fastestTime.toFixed(2)}` : 'No fastest time yet')

        setTimeout(() => {
            startRandomCountdown()
        }, 1000)
    }, 200)
}

function startRandomCountdown() {
    const randomTime = Math.round(Math.random() * 12000)
    setTimeout(() => {
        if(!gameOn) { return }
        reactionStartTime = new Date()
        led(LED3, 1, 50)
    }, randomTime)
}

function endGame() {
    gameOn = false
}

function resetGame() {
    console.log('Resetting game')
    endGame()
    fastestTime = null
}

function detectLongPress() {
    let resetGameTimeoutCleared = false
    const resetGameTimeout = setTimeout(() => {
        resetGameTimeoutCleared = true
        led(LED3, 4, 300, 200)
        resetGame()
    }, 3000)

    const resetGameInterval = setInterval(() => {
        if(digitalRead(BTN) === 0) {
            clearTimeout(resetGameInterval)
            if(!resetGameTimeoutCleared) {
                clearTimeout(resetGameTimeout)
            }
        }
    }, 50)
}

function led(leds, times, durOn, durOff) {
    let i = 0
    let x = 0
    if(!Array.isArray(leds)) {
        leds = [leds]
    }

    function singleLoop(arr, callback) {
        digitalWrite(arr[i], 1)
        setTimeout(() => {
            digitalWrite(arr[i], 0)
            setTimeout(() => {
                i++
                if(i < arr.length) {
                    singleLoop(arr, callback)
                }
                else {
                    i = 0
                    callback()
                }
            },  durOff || durOn)
        }, durOn)
    }

    function loop(arr) {
        singleLoop(arr, () => {
            x++
            if(x < times) {
                loop(arr)
            }
        })
    }

    loop(leds)
}

setWatch(() => {
    let reactionTime
    detectLongPress()
    if(!gameOn) {
        turnGameOn()
    }
    else {
        reactionTime = new Date() - reactionStartTime
        if(!fastestTime || reactionTime < fastestTime) {
            console.log(`New fastest time: ${reactionTime.toFixed(2)}`)
            led(LED2, 3, 300, 150)
            fastestTime = reactionTime
        }
        else {
            console.log('Lost')
            led(LED1, 4, 100)
        }
        endGame()
    }
}, BTN, {edge: 'rising', debounce: 50, repeat: true})
