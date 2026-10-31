const screens = document.querySelectorAll("section");
const survivalBtn = document.getElementById("survivalBtn");
const timeAttackBtn = document.getElementById("timeAttackBtn");
const puzzleBtn = document.getElementById("puzzleBtn");
const backHome = document.getElementById("backHome");
const setupTitle = document.getElementById("setupTitle");
const timeOptions = document.getElementById("timeOptions");
const startBtn = document.getElementById("startBtn");
const customTime = document.getElementById("customTime");
const timerFill = document.getElementById("timerFill");
const timeText = document.getElementById("timeText");
const scoreText = document.getElementById("scoreText");
const questionText = document.getElementById("questionText");
const optionButtons = document.querySelectorAll(".option");



const gameNames={
    survival: "Survival",
    timeAttack: "Time Attack",
    puzzle: "Equation Puzzle"
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

function startTimer(){
    clearInterval(timerId);
    totalTime = getQuestionTime();
    timeLeft = totalTime;
    timerFill.style.width = "100%";
    timeText.textContent = totalTime / 1000;
    timerId = setInterval(function(){
        timeLeft = timeLeft - 100;
        timerFill.style.width = timeLeft / totalTime * 100 + "%";
        timeText.textContent = Math.ceil(timeLeft / 1000);
        if(timeLeft <= 0){
            endSurvival();
        }
    }, 100);
}

function showQuestion(){
    const question = makeQuestion(difficulty);
    correctAnswer = question.answer;
    questionText.textContent = question.text + " = ?";
    const options = makeOptions(correctAnswer);
    for(let i = 0; i < 4; i++){
        optionButtons[i].textContent = options[i];
    }
    startTimer();
}





function openSetup(game){
    chosenGame = game;
    setupTitle.textContent = gameNames[game];
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

startBtn.addEventListener("click", function () {
    difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    timeLimit = Number(document.querySelector('input[name="time"]:checked').value);
    if (customTime.value !== "") {
        timeLimit = Number(customTime.value);
    }
    console.log(chosenGame, difficulty, timeLimit);
    showScreen(chosenGame);
});



