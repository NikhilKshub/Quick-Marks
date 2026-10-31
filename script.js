const screens = document.querySelectorAll("section");
const survivalBtn = document.getElementById("survivalBtn");
const timeAttackBtn = document.getElementById("timeAttackBtn");
const puzzleBtn = document.getElementById("puzzleBtn");
const backHome = document.getElementById("backHome");
const setupTitle = document.getElementById("setupTitle");
const timeOptions = document.getElementById("timeOptions");
const startBtn = document.getElementById("startBtn");
const customTime = document.getElementById("customTime");

const gameNames={
    survival: "Survival",
    timeAttack: "Time Attack",
    puzzle: "Equation Puzzle"
};

let chosenGame = "";
let difficulty = "";
let timeLimit = 60;

function showScreen(name){
    for(const screen of screens){
        screen.classList.add("hidden");
    }
    document.getElementById(name).classList.remove("hidden");
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


