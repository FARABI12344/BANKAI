let startTime;
let reactionTimes = [];
let box = document.getElementById("reaction-box");
let tryAgainBtn = document.getElementById("try-again");

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") handleClick();
});

box.addEventListener("click", handleClick);
tryAgainBtn.addEventListener("click", startGame);

function handleClick() {
    if (box.classList.contains("red-box")) {
        let reactionTime = Date.now() - startTime;
        reactionTimes.push(reactionTime);

        showResult(reactionTime);
        updateHistory();
        tryAgainBtn.classList.remove("hidden");
    }
}

function startGame() {
    box.classList.remove("red-box");
    box.classList.add("green-box");
    box.innerText = "WAIT...";

    tryAgainBtn.classList.add("hidden");

    let randomDelay = Math.floor(Math.random() * 3000) + 2000;

    setTimeout(() => {
        box.classList.remove("green-box");
        box.classList.add("red-box");

        startTime = Date.now();
        box.innerText = "CLICK!";
    }, randomDelay);
}

function showResult(reactionTime) {
    let resultStatus;
    
    if (reactionTime < 150) {
        resultStatus = "CHEATER";
    } else if (reactionTime < 200) {
        resultStatus = "ATHLETE [EXTREMELY PRO]";
    } else if (reactionTime < 300) {
        resultStatus = "GAMER [PRO]";
    } else if (reactionTime < 350) {
        resultStatus = "AVERAGE [NORMAL]";
    } else {
        resultStatus = "NOOB";
    }

    box.innerHTML = `${reactionTime}ms <br> ${resultStatus}`;
}

function updateHistory() {
    let historyList = document.getElementById("history");
    historyList.innerHTML = "";

    reactionTimes.forEach(time => {
        let li = document.createElement("li");
        li.textContent = `${time}ms`;
        historyList.appendChild(li);
    });

    let avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    document.getElementById("result-text").innerText = `AVERAGE: ${Math.round(avgTime)}ms`;
}

document.getElementById("clear-history").addEventListener("click", function () {
    reactionTimes = [];
    updateHistory();
    document.getElementById("result-text").innerText = "AVERAGE: --ms";
});

startGame();
