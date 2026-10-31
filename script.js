const screens = document.querySelectorAll("section");
const survivalBtn = document.getElementById("survivalBtn");
const timeAttackBtn = document.getElementById("timeAttackBtn");
const puzzleBtn = document.getElementById("puzzleBtn");
const backHome = document.getElementById("backHome");


let chosenGame = "";


function showScreen(name){
    for(const screen of screens){
        screen.classList.add("hidden");
    }
    document.getElementById(name).classList.remove("hidden");
}

showScreen("home");

survivalBtn.addEventListener("click",function(){
    chosenGame = "survival";
    showScreen("setup");
});

timeAttackBtn.addEventListener("click",function(){
    chosenGame="timeAttack";
    showScreen("setup");
});

puzzleBtn.addEventListener("click",function(){
    chosenGame="puzzle";
    showScreen("setup");
});

backHome.addEventListener("click",function(){
    showScreen("home");
});