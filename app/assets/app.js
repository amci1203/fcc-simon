const
    get = id => document.getElementById(id),
    click = (elm, fn) => elm.addEventListener('click', fn),

    buttons = {
        red    : get('red'),
        green  : get('green'),
        yellow : get('yellow'),
        blue   : get('blue'),
    },

    beeps = {
        red    : get('red-beep'),
        green  : get('green-beep'),
        yellow : get('yellow-beep'),
        blue   : get('blue-beep'),
    },

    colors = Object.keys(buttons),

    winScreen    = get('win'),
    winRestart   = get('win-replay'),
    gameToggle   = get('toggle-game'),
    gameRestart  = get('restart-game'),
    strictToggle = get('strict-toggle'),
    count        = get('count'),

    wait = 1000,
    goal = 20,

    anyActive      = () => document.querySelector('.selected'),
    selectActive   = el => el.classList.add('selected'),
    deselectActive = () => anyActive() && document.querySelector('.selected').classList.remove('selected'),
    updateCount    = n  => count.innerText = n ? n : pattern.length,
    nope           = () => count.innerHTML = '&#10005',
    roundDone      = () => count.innerHTML = '&#10003';

let
    pattern = [],
    playing = false,
    beeping = false,
    strict  = false,
    index   = 0;


function startGame () {
    playing = true;
    index   = 0;
    gameToggle.innerText = 'STOP';
    playPattern(true);
}

function stopGame () {
    anyActive() && deselectActive();

    pattern = [];
    playing = false;

    gameToggle.innerText = 'START';
    updateCount();
}

function restartGame (fn, fromWin) {
    let wait = 0;
    if (fromWin) {
        winScreen.classList.remove('active');
        wait = 1000;
    }
    if (playing || fn) {
        setTimeout(() =>{
            stopGame();
            typeof fn == 'function' && fn();
            startGame();
        }, wait);
    }

    else return false
}

function playPattern (cont, isReplay) {
    if (!playing) return false;

    // add another color and take it from the top once done
    if (!isReplay || cont) {
        pattern.push( colors[ Math.floor( Math.random() * 4 ) ] );
        index = 0;
    }

    beepSequence(index);
//    console.log(pattern);
}

function beep (color) {
    beeping = true;
    selectActive(buttons[color]);
    beeps[color].play();
    setTimeout(() => {
        deselectActive();
        beeping = false;
    }, wait * 0.5);
}

function beepSequence (i) {
    updateCount(i + 1);
    beep(pattern[i]);
    if (i !== pattern.length - 1) setTimeout(() => beepSequence(i + 1), wait)
    else updateCount();
}

function checkAttempt (color) {

    if (!playing || beeping) return false;

    const correct = color === pattern[index];

    beep(color);

    if (!correct) {
        nope();
        index = 0;
        // strict mode resets the pattern at incorrect guess
        if (strict) {
            pattern = [];
        }
        setTimeout(() => playPattern(strict, true), wait * 1.1);
    }
    else {
        // increment index; once we hit the end, play the pattern (which will add one)
        index++;
        updateCount(pattern.length - index);

        if (index === goal) {
            winScreen.classList.add('active');
            return;
        }

        if (index === pattern.length) {
            roundDone();
            setTimeout(() => playPattern(true), wait * 1.45)
        };

    }

}

function toggleStrictMode () {
    // can only be switched if no game is currently in session
    if (!playing) {
        strict = !strict;
        strictToggle.classList.toggle('active', strict);
    }
    else {
        const sure = confirm('Switch modes? The current game will be stopped.');
        sure && restartGame(toggleStrictMode);
    }
}

// UTILITY FUNCTIONS ////////////////////////////////////////////////////////////////////////////

function generatePattern (len) {
    restartGame(() => {
        const stop = len - 1 || goal - 1; // playPattern() will add the final sequence
        for (let i = 0; i < stop; i++) {
            pattern.push( colors[ Math.floor( Math.random() * 4 ) ] );
        }
        setTimeout(() => {}, 500);
    })
}

function simulatePlay () {
    buttons[ pattern[index] ].click();
    if (index !== pattern.length) setTimeout(() => simulatePlay(index + 1), wait + 50);
    else return;
}

window.play = simulatePlay;
window.generate = generatePattern;

console.log(`
ATTN: two (2) functions are readily available if you're too lazy to repeatedly play like me.

generate(n): generates a pattern of n steps; default is the goal of 20.

play(): clicks through the steps so you don't have to. Steps through using the same index variable as manual clicking, so you can change your mind anytime
`)

// generatePattern(20);



click(strictToggle, toggleStrictMode);
click(gameRestart, restartGame);
click(winRestart, restartGame.bind(null, null, true));
click(gameToggle, () => playing ? stopGame() : startGame());
colors.forEach(c => click(buttons[c], e => checkAttempt(c)));
