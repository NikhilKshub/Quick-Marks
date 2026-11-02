const screens = document.querySelectorAll("section");
const survivalBtn = document.getElementById("survivalBtn");
const timeAttackBtn = document.getElementById("timeAttackBtn");
const puzzleBtn = document.getElementById("puzzleBtn");
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
const playAgain = document.getElementById("playAgain");
const resultHome = document.getElementById("resultHome");

const gameNames={
    survival: "Survival",
    timeAttack: "Time Attack",
    puzzle: "Equation Puzzle"
};

const gameRules={
    survival: "One wrong answer or a timeout ends the run.The timer gets shorter as your score grows.",
    timeAttack: "Answer as many as you can before time runs out. A wrong answer costs 2 seconds.",
    puzzle: "Fill every box so each equation is true. Each tile can be used once."
};

let chosenGame = "";
let difficulty = "";
let timeLimit = 60;
let score=0 ;
let correctAnswer = 0;
let timeLeft = 0;
let totalTime = 5000;
let timerId= null;


function randomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const sizes = {
    easy: {max:20, table:9},
    medium: {max:99, table:12},
    hard: {max:999, table:15}
};

function showScreen(name){
    for(const screen of screens){
        screen.classList.add("hidden");
    }
    document.getElementById(name).classList.remove("hidden");
}

// Questions
const operations = ["add","subtract", "multiply", "divide"];

function makeEndingBig(number){
    return Math.floor(number / 10) * 10 + randomNumber(6,9);
}

function makeQuestion(difficulty){
    const size = sizes[difficulty];
    const operation = operations[randomNumber(0, operations.length - 1)];
    let first = randomNumber(2, size.max);
    let second = randomNumber(2, size.max);
    if(randomNumber(1,2) === 1){
        second = makeEndingBig(second);
    }

    if(operation === "add"){
        return{
            text: first + " + " + second,
            answer: first + second
        };
    }
    if(operation === "subtract"){
        const big = Math.max(first, second);
        const small = Math.min(first, second);
        return{
            text: big + " - " + small,
            answer: big - small
        };
    }
    if(operation === "multiply"){
        const left = randomNumber(2, size.table);
        const right = randomNumber(2, size.table);
        return{
            text: left + " × " + right,
            answer:left * right
        };
    }
    if(operation === "divide"){
        const divisor = randomNumber(2, size.table);
        const result = randomNumber(2, size.table);
        const total = divisor * result;
        return{
            text: total + " ÷ " + divisor,
            answer: result
        };
    }
}

// Options 
function makeOptions(answer){
    const options = [answer];
    while (options.length < 4){
        const wrong = answer + randomNumber(-10, 10);
        if(wrong >= 0 && !options.includes(wrong)){
            options.push(wrong);
        }
    }
    options.sort(function(){
        return Math.random() - 0.5;
    });
    return options;
}

function getQuestionTime(){
    return Math.max(3, 5 - Math.floor(score / 5)) * 1000;
}

function checkAttackAnswer(chosen){
    if(chosen === correctAnswer){
        score = score+1;
        attackScoreText.textContent = score;
    } else {
        timeLeft = timeLeft - 2000;
    }
    showAttackQuestion();
}

function startAttack(){
    score = 0;
    attackScoreText.textContent = 0;
    showScreen("timeAttack");
    showAttackQuestion();
    startCountdown(attackFill, attackTimeText, timeLimit * 1000);
}

for(const button of attackButtons){
    button.addEventListener("click", function(){
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

function startCountdown(fillElement, textElement, ms){
    clearInterval(timerId);
    totalTime=ms;
    timeLeft=ms;
    fillElement.style.width = "100%";
    textElement.textContent=ms / 1000;
    timerId = setInterval(function(){
        timeLeft = timeLeft - 100;
        fillElement.style.width = timeLeft / totalTime * 100 + "%";
        textElement.textContent = Math.max(0, Math.ceil(timeLeft / 1000));
        if(timeLeft <=0 ){
            endGame();
        }
    },100);
}


function showQuestion(){
    fillQuestion(questionText, optionButtons);
    startCountdown(timerFill, timeText, getQuestionTime());
}
function showAttackQuestion(){
    fillQuestion(attackQuestion, attackButtons);
}

function checkSurvivalAnswer(chosen){
    if(chosen === correctAnswer){
        score = score + 1;
        scoreText.textContent = score;
        showQuestion();
    } else {
        endGame();
    }
}

for (const button of optionButtons){
    button.addEventListener("click", function(){
        checkSurvivalAnswer(Number(button.textContent));
    });
}

function getMessage(points){
    if(points < 5){
        return "A good start. One more run and you will be sharper.";
    }
    if(points < 10){
        return "Getting sharp. Push for 10 next time.";
    }
    if(points < 20){
        return "Quick thinking. That was a strong run.";
    }
    return "Excellent. This is mental maths at speed.";
}

function endGame(){
    clearInterval(timerId);
    resultScore.textContent = score;
    resultMessage.textContent = getMessage(score);
    showScreen("result");
}

function startSurvival(){
    score = 0;
    scoreText.textContent = 0;
    showScreen("survival");
    showQuestion();
}

function startGame(){
    if(chosenGame === "survival"){
        startSurvival();
    } else if(chosenGame === "timeAttack"){
        startAttack();
    } else{
        showScreen(chosenGame);
    }
    
}


function openSetup(game){
    chosenGame = game;
    setupTitle.textContent = gameNames[game];
    ruleText.textContent = gameRules[game];
    if(game === "timeAttack"){
        timeOptions.classList.remove("hidden");
    } else {
        timeOptions.classList.add("hidden");
    }
    showScreen("setup");
}
showScreen("home");

survivalBtn.addEventListener("click",function(){
    openSetup("survival");
});

timeAttackBtn.addEventListener("click",function(){
    openSetup("timeAttack");
});

puzzleBtn.addEventListener("click",function(){
    openSetup("puzzle");
});

backHome.addEventListener("click",function(){
    showScreen("home");
});

playAgain.addEventListener("click", function(){
    startGame();
});

resultHome.addEventListener("click", function(){
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










