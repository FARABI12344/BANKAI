let startTime;
let reactionTimes = [];
let box = document.getElementById("reaction-box");

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") handleClick();
});

box.addEventListener("click", handleClick);

function handleClick() {
    if (box.classList.contains("red-box")) {
        let reactionTime = Date.now() - startTime;
        reactionTimes.push(reactionTime);

        showResult(reactionTime);
        updateHistory();
        startGame();
    }
}

function startGame() {
    box.classList.remove("red-box");
    box.classList.add("green-box");
    
    document.getElementById("result-text").innerText = "WAIT FOR IT...";
    
    let randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2 to 5 seconds

    setTimeout(() => {
        box.classList.remove("green-box");
        box.classList.add("red-box");

        startTime = Date.now();
        document.getElementById("result-text").innerText = "CLICK NOW!";
    }, randomDelay);
}

function showResult(reactionTime) {
    let resultText = document.getElementById("result-text");

    if (reactionTime < 80) {
        resultText.innerHTML = `🔥 ${reactionTime}MS → CHEATING`;
    } else if (reactionTime < 150) {
        resultText.innerHTML = `⚡ ${reactionTime}MS → ATHLETE [ULTRA PRO]`;
    } else if (reactionTime < 200) {
        resultText.innerHTML = `🎮 ${reactionTime}MS → GAMERS [PRO]`;
    } else if (reactionTime < 300) {
        resultText.innerHTML = `🙂 ${reactionTime}MS → NORMAL [AVERAGE]`;
    } else {
        resultText.innerHTML = `🐢 ${reactionTime}MS → NOOB`;
    }
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
