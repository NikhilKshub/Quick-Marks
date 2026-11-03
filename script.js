const screens = document.querySelectorAll("section");
const backHome = document.getElementById("backHome");
const setupTitle = document.getElementById("setupTitle");
const ruleText = document.getElementById("ruleText");
const timeOptions = document.getElementById("timeOptions");
const startBtn = document.getElementById("startBtn");
const customTime = document.getElementById("customTime");
const timerFill = document.getElementById("timerFill");
const timeText = document.getElementById("timeText");
const scoreText = document.getElementById("scoreText");
const questionText = document.getElementById("questionText");
const optionButtons = document.querySelectorAll("#survival .option");
const attackFill = document.getElementById("attackFill");
const attackTimeText = document.getElementById("attackTimeText");
const attackScoreText = document.getElementById("attackScoreText");
const attackQuestion = document.getElementById("attackQuestion");
const attackButtons = document.querySelectorAll("#timeAttack .option");
const resultScore = document.getElementById("resultScore");
const resultMessage = document.getElementById("resultMessage");
const puzzleTimeText = document.getElementById("puzzleTimeText");
const puzzleScoreText = document.getElementById("puzzleScoreText");
const resultLabel = document.getElementById("resultLabel");
const skipBtn = document.getElementById("skipBtn");
const equationRows = document.querySelectorAll("#puzzle .equation");
const boxButtons = document.querySelectorAll("#puzzle .box");
const tileElements = document.querySelectorAll("#puzzle .tile");
const opTexts = document.querySelectorAll("#puzzle .op");
const resultTexts = document.querySelectorAll("#puzzle .result");
const boardsToSolve = 3;
const playAgain = document.getElementById("playAgain");
const resultHome = document.getElementById("resultHome");
const survivalBest = document.getElementById("survivalBest");
const timeAttackBest = document.getElementById("timeAttackBest");
const puzzleBest = document.getElementById("puzzleBest");

const gameNames = {
    survival: "Survival",
    timeAttack: "Time Attack",
    puzzle: "Equation Puzzle"
};

const gameRules = {
    survival: "One wrong answer or a timeout ends the run. The timer gets shorter as your score grows.",
    timeAttack: "Answer as many as you can before time runs out. A wrong answer costs 2 seconds.",
    puzzle: "Drag each tile into a box. Make all five equations true. Solve 3 boards as fast as you can. Skipping adds 15 seconds."
};

let chosenGame = "";
let difficulty = "";
let timeLimit = 60;
let score = 0;
let correctAnswer = 0;
let timeLeft = 0;
let totalTime = 5000;
let timerId = null;
let tileNumbers = [];
let draggedTile = -1;
let boxTile = [];
let rowOps = [];
let rowResults = [];
let rowState = [];
let boardsSolved = 0;
let seconds = 0;

const bestScores = {
    survival : 0,
    timeAttack: 0,
    puzzle: 0
};

for(const game in bestScores){
    const saved = localStorage.getItem("best-" + game);
    if(saved !== null){
        bestScores[game] = Number(saved);
    }
}

function showBest(){
    survivalBest.textContent = bestScores.survival;
    timeAttackBest.textContent = bestScores.timeAttack;
    puzzleBest.textContent = bestScores.puzzle === 0 ? "none yet" : bestScores.puzzle + "s";
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const sizes = {
    easy: { max: 20, table: 9 },
    medium: { max: 99, table: 12 },
    hard: { max: 999, table: 15 }
};

function showScreen(name) {
    for (const screen of screens) {
        screen.classList.add("hidden");
    }
    document.getElementById(name).classList.remove("hidden");
}

// Questions
const operations = ["add", "subtract", "multiply", "divide"];

function makeEndingBig(number) {
    return Math.floor(number / 10) * 10 + randomNumber(6, 9);
}

function makeQuestion(difficulty) {
    const size = sizes[difficulty];
    const operation = operations[randomNumber(0, operations.length - 1)];
    let first = randomNumber(2, size.max);
    let second = randomNumber(2, size.max);
    if (randomNumber(1, 2) === 1) {
        second = makeEndingBig(second);
    }

    if (operation === "add") {
        return {
            text: first + " + " + second,
            answer: first + second
        };
    }
    if (operation === "subtract") {
        const big = Math.max(first, second);
        const small = Math.min(first, second);
        return {
            text: big + " - " + small,
            answer: big - small
        };
    }
    if (operation === "multiply") {
        const left = randomNumber(2, size.table);
        const right = randomNumber(2, size.table);
        return {
            text: left + " × " + right,
            answer: left * right
        };
    }
    if (operation === "divide") {
        const divisor = randomNumber(2, size.table);
        const result = randomNumber(2, size.table);
        const total = divisor * result;
        return {
            text: total + " ÷ " + divisor,
            answer: result
        };
    }
}

// Options 
function makeOptions(answer) {
    const options = [answer];
    while (options.length < 4) {
        const wrong = answer + randomNumber(-10, 10);
        if (wrong >= 0 && !options.includes(wrong)) {
            options.push(wrong);
        }
    }
    options.sort(function () {
        return Math.random() - 0.5;
    });
    return options;
}

// puzzle game
const opsByLevel = {
    easy: ["+", "-"],
    medium: ["+", "-", "×"],
    hard: ["+", "-", "×", "÷"]
};

function makeBoard() {
    const numbers = [];
    rowOps = [];
    rowResults = [];
    rowState = [];
    boxTile = [];
    for (let r = 0; r < 5; r++) {
        const op = opsByLevel[difficulty][randomNumber(0, opsByLevel[difficulty].length - 1)];
        const max = sizes[difficulty].table;
        let left;
        let right;
        let result;
        if (op === "+") {
            left = randomNumber(1, max);
            right = randomNumber(1, max);
            result = left + right;
        } else if (op === "-") {
            left = randomNumber(2, max);
            right = randomNumber(1, left - 1);
            result = left - right;
        } else if (op === "×") {
            left = randomNumber(2, max);
            right = randomNumber(2, max);
            result = left * right;
        } else if (op === "÷") {
            right = randomNumber(2, max);
            result = randomNumber(2, max);
            left = right * result;
        }
        rowOps.push(op);
        rowResults.push(result);
        rowState.push("");
        numbers.push(left, right);
    }
    tileNumbers = numbers;
    tileNumbers.sort(function () {
        return Math.random() - 0.5;
    });
    for (let i = 0; i < 10; i++) {
        boxTile.push(-1);
    }
}

function drawBoard() {
    for (let r = 0; r < 5; r++) {
        opTexts[r].textContent = rowOps[r];
        resultTexts[r].textContent = rowResults[r];
        equationRows[r].className = "equation " + rowState[r];
    }
    for (let j = 0; j < 10; j++) {
        boxButtons[j].textContent = boxTile[j] === -1 ? "" : tileNumbers[boxTile[j]];
    }
    for (let i = 0; i < 10; i++) {
        tileElements[i].textContent = tileNumbers[i];
        tileElements[i].classList.toggle("used", boxTile.includes(i));
    }
}

function calculate(op, left, right) {
    if (op === "+") {
        return left + right;
    }
    if (op === "-") {
        return left - right;
    }
    if (op === "×") {
        return left * right;
    }
    return left / right;
}

function checkRow(r) {
    const leftTile = boxTile[r * 2];
    const rightTile = boxTile[r * 2 + 1];
    if (leftTile === -1 || rightTile === -1) {
        return;
    }
    const value = calculate(rowOps[r], tileNumbers[leftTile], tileNumbers[rightTile]);
    rowState[r] = value === rowResults[r] ? "right" : "wrong";
}

function startPuzzle() {
    boardsSolved = 0;
    puzzleScoreText.textContent = 0;
    seconds = 0;
    puzzleTimeText.textContent = 0;
    makeBoard();
    drawBoard();
    showScreen("puzzle");
    clearInterval(timerId);
    timerId = setInterval(function () {
        seconds = seconds + 1;
        puzzleTimeText.textContent = seconds;
    }, 1000);
}

function getQuestionTime() {
    return Math.max(3, 5 - Math.floor(score / 5)) * 1000;
}

function checkAttackAnswer(chosen) {
    if (chosen === correctAnswer) {
        score = score + 1;
        attackScoreText.textContent = score;
    } else {
        timeLeft = timeLeft - 2000;
    }
    showAttackQuestion();
}

function startAttack() {
    score = 0;
    attackScoreText.textContent = 0;
    showScreen("timeAttack");
    showAttackQuestion();
    startCountdown(attackFill, attackTimeText, timeLimit * 1000);
}

for (const button of attackButtons) {
    button.addEventListener("click", function () {
        checkAttackAnswer(Number(button.textContent));
    });
}

function fillQuestion(textElement, buttons) {
    const question = makeQuestion(difficulty);
    correctAnswer = question.answer;
    textElement.textContent = question.text + " = ?";
    const options = makeOptions(correctAnswer);
    for (let i = 0; i < 4; i++) {
        buttons[i].textContent = options[i];
    }
}

function startCountdown(fillElement, textElement, ms) {
    clearInterval(timerId);
    totalTime = ms;
    timeLeft = ms;
    fillElement.style.width = "100%";
    textElement.textContent = ms / 1000;
    timerId = setInterval(function () {
        timeLeft = timeLeft - 100;
        fillElement.style.width = timeLeft / totalTime * 100 + "%";
        textElement.textContent = Math.max(0, Math.ceil(timeLeft / 1000));
        if (timeLeft <= 0) {
            endGame();
        }
    }, 100);
}


function showQuestion() {
    fillQuestion(questionText, optionButtons);
    startCountdown(timerFill, timeText, getQuestionTime());
}
function showAttackQuestion() {
    fillQuestion(attackQuestion, attackButtons);
}

function checkSurvivalAnswer(chosen) {
    if (chosen === correctAnswer) {
        score = score + 1;
        scoreText.textContent = score;
        showQuestion();
    } else {
        endGame();
    }
}

for (const button of optionButtons) {
    button.addEventListener("click", function () {
        checkSurvivalAnswer(Number(button.textContent));
    });
}

function getMessage(points) {
    if (points < 5) {
        return "A good start. One more run and you will be sharper.";
    }
    if (points < 10) {
        return "Getting sharp. Push for 10 next time.";
    }
    if (points < 20) {
        return "Quick thinking. That was a strong run.";
    }
    return "Excellent. This is mental maths at speed.";
}

function getPuzzleMessage(sec) {
    if (sec < 60) {
        return "Lightning fast. That is top-level mental maths.";
    }
    if (sec < 120) {
        return "Sharp work. Can you beat 60 seconds?";
    }
    if (sec < 200) {
        return "Steady hands. Try to go faster next time.";
    }
    return "You finished it. One more run and you will be quicker.";
}

function endPuzzle() {
    clearInterval(timerId);
    resultLabel.textContent = "Your time";
    resultScore.textContent = seconds + "s";
    resultMessage.textContent = getPuzzleMessage(seconds);
    setTimeout(function () {
        showScreen("result");
    }, 800);
}

function boardDone() {
    boardsSolved = boardsSolved + 1;
    puzzleScoreText.textContent = boardsSolved;
    if (boardsSolved === boardsToSolve) {
        endPuzzle();
    } else {
        setTimeout(function () {
            makeBoard();
            drawBoard();
        }, 800);
    }
}

function placeTile(tileIndex, boxIndex) {
    if (boxTile.includes(tileIndex)) {
        return;
    }
    if (boxTile[boxIndex] !== -1) {
        return;
    }
    boxTile[boxIndex] = tileIndex;
    checkRow(Math.floor(boxIndex / 2));
    drawBoard();
    let allRight = true;
    for (const state of rowState) {
        if (state !== "right") {
            allRight = false;
        }
    }
    if (allRight) {
        boardDone();
    }
}

function endGame() {
    clearInterval(timerId);
    resultLabel.textContent = "Your score";
    resultScore.textContent = score;
    resultMessage.textContent = getMessage(score);
    showScreen("result");
}

function startSurvival() {
    score = 0;
    scoreText.textContent = 0;
    showScreen("survival");
    showQuestion();
}

function startGame() {
    if (chosenGame === "survival") {
        startSurvival();
    } else if (chosenGame === "timeAttack") {
        startAttack();
    } else {
        startPuzzle();
    }
}

function openSetup(game) {
    chosenGame = game;
    setupTitle.textContent = gameNames[game];
    ruleText.textContent = gameRules[game];
    customTime.value = "";
    if (game === "timeAttack") {
        timeOptions.classList.remove("hidden");
    } else {
        timeOptions.classList.add("hidden");
    }
    showScreen("setup");
}
showScreen("home");
showBest();

function saveBest(game, value){
    let better;
    if(game === "puzzle"){
        better = bestScores.puzzle === 0 || value<bestScores.puzzle;
    } else {
        better = value>bestScores[game];
    }
    if(better){
        bestScores[game] = value;
        localStorage.setItem("best-" + game, value);
        showBest();
    }
    return better;
}

for (const card of document.querySelectorAll(".gameCard")) {
    card.addEventListener("click", function () {
        openSetup(card.dataset.game);
    });
}

backHome.addEventListener("click", function () {
    showScreen("home");
});

playAgain.addEventListener("click", function () {
    startGame();
});

resultHome.addEventListener("click", function () {
    showScreen("home");
});

startBtn.addEventListener("click", function () {
    difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    timeLimit = Number(document.querySelector('input[name="time"]:checked').value);
    if (customTime.value !== "") {
        timeLimit = Number(customTime.value);
        timeLimit = Math.min(300, Math.max(10, timeLimit));
    }
    startGame();
});

skipBtn.addEventListener("click", function () {
    seconds = seconds + 15;
    puzzleTimeText.textContent = seconds;
    makeBoard();
    drawBoard();
});

for (let i = 0; i < 10; i++) {
    tileElements[i].addEventListener("dragstart", function (event) {
        draggedTile = i;
        event.dataTransfer.setData("text", i);
    });
    tileElements[i].addEventListener("dragend", function () {
        draggedTile = -1;
        for (const box of boxButtons) {
            box.classList.remove("over");
        }
    });
}

for (let j = 0; j < 10; j++) {
    boxButtons[j].addEventListener("click", function () {
        if (boxTile[j] !== -1) {
            boxTile[j] = -1;
            rowState[Math.floor(j / 2)] = "";
            drawBoard();
        }
    });
    boxButtons[j].addEventListener("dragover", function (event) {
        if (boxTile[j] === -1) {
            event.preventDefault();
            boxButtons[j].classList.add("over");
        }
    });
    boxButtons[j].addEventListener("dragleave", function () {
        boxButtons[j].classList.remove("over");
    });
    boxButtons[j].addEventListener("drop", function (event) {
        event.preventDefault();
        boxButtons[j].classList.remove("over");
        if (draggedTile !== -1) {
            placeTile(draggedTile, j);
        }
        draggedTile = -1;
    });
}

