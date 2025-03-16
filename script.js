const playButton = document.getElementById('play-button');
const gameScreen = document.getElementById('game-screen');
const wordContainer = document.getElementById('word-container');
const result = document.getElementById('result');

let words = [];
let currentWordIndex = 0;
let startTime;

// Load words from JSON file
fetch('assets/words.json')
  .then(response => response.json())
  .then(data => {
    words = data;
  });

playButton.addEventListener('click', startGame);

function startGame() {
  playButton.classList.add('hidden');
  gameScreen.style.display = 'block';
  loadWord();
}

function loadWord() {
  if (currentWordIndex >= words.length) {
    result.textContent = "You've completed all words!";
    return;
  }

  const word = words[currentWordIndex];
  const shuffledLetters = shuffle(word.split(''));

  wordContainer.innerHTML = '';
  shuffledLetters.forEach(letter => {
    const letterElement = document.createElement('div');
    letterElement.classList.add('letter');
    letterElement.textContent = letter;
    wordContainer.appendChild(letterElement);
    makeDraggable(letterElement);
  });

  startTime = Date.now();
  setTimeout(checkWin, 120000); // 2 minutes
}

function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    element.style.position = 'absolute';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function checkWin() {
  const letters = Array.from(wordContainer.children);
  const word = words[currentWordIndex];
  const userWord = letters.map(letter => letter.textContent).join('');

  if (userWord === word) {
    result.textContent = "You win!";
  } else {
    result.textContent = "You lose!";
  }

  currentWordIndex++;
  setTimeout(loadWord, 2000); // Load next word after 2 seconds
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
