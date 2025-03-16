document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('play-button');
  const gameScreen = document.getElementById('game-screen');
  const dropContainer = document.getElementById('drop-container');
  const draggableContainer = document.getElementById('draggable-container');
  const resultDisplay = document.getElementById('result');

  let words = [];
  let currentWordIndex = 0;
  let wordTimer;

  // Load words from JSON file (format: ["COOK", "GAME", ...])
  fetch('words.json')
    .then(response => response.json())
    .then(data => {
      words = data;
    });

  playButton.addEventListener('click', startGame);

  function startGame() {
    playButton.style.display = 'none';
    gameScreen.style.display = 'block';
    loadWord();
  }

  function loadWord() {
    clearTimeout(wordTimer);
    resultDisplay.textContent = "";
    dropContainer.innerHTML = "";
    draggableContainer.innerHTML = "";

    if (currentWordIndex >= words.length) {
      resultDisplay.textContent = "You've completed all words!";
      return;
    }

    const word = words[currentWordIndex];
    
    // Create drop zones for each letter in the word
    for (let i = 0; i < word.length; i++) {
      const dropZone = document.createElement('div');
      dropZone.classList.add('drop-zone');
      dropZone.dataset.index = i;
      dropContainer.appendChild(dropZone);
    }

    // Shuffle letters and create draggable elements
    const letters = word.split('');
    const shuffledLetters = shuffle(letters);

    // Set initial positions for draggable letters randomly within the container
    shuffledLetters.forEach((letter, index) => {
      const letterElem = document.createElement('div');
      letterElem.classList.add('letter');
      letterElem.textContent = letter;
      // Position letters randomly within the draggable container bounds
      const containerRect = draggableContainer.getBoundingClientRect();
      const x = Math.random() * (containerRect.width - 60);
      const y = Math.random() * (containerRect.height - 60);
      letterElem.style.left = `${x}px`;
      letterElem.style.top = `${y}px`;
      draggableContainer.appendChild(letterElem);
      makeDraggable(letterElem);
    });

    // Set timer for 2 minutes per word
    wordTimer = setTimeout(() => {
      checkResult();
    }, 120000);
  }

  function makeDraggable(elem) {
    let offsetX, offsetY;
    let isDragging = false;
    let originalParent = elem.parentElement;
    let originalNextSibling = elem.nextSibling;

    elem.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = elem.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      // Detach element and add to body for free dragging
      originalParent = elem.parentElement;
      originalNextSibling = elem.nextSibling;
      elem.style.position = 'absolute';
      elem.style.left = rect.left + 'px';
      elem.style.top = rect.top + 'px';
      document.body.appendChild(elem);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      elem.style.left = (e.clientX - offsetX) + 'px';
      elem.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      let dropped = false;
      // Check if dropped over any drop zone
      document.querySelectorAll('.drop-zone').forEach(zone => {
        const rect = zone.getBoundingClientRect();
        if (
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom
        ) {
          // Only drop if the zone is empty
          if (zone.children.length === 0) {
            zone.appendChild(elem);
            elem.style.position = 'relative';
            elem.style.left = '0';
            elem.style.top = '0';
            dropped = true;
          }
        }
      });
      if (!dropped) {
        // Return the letter back to the draggable container if not dropped in a zone
        originalParent.insertBefore(elem, originalNextSibling);
        elem.style.position = 'relative';
        elem.style.left = '0';
        elem.style.top = '0';
      }
      checkResult();
    });
  }

  function checkResult() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let assembledWord = '';
    let allFilled = true;
    dropZones.forEach(zone => {
      if (zone.children.length > 0) {
        assembledWord += zone.children[0].textContent;
      } else {
        allFilled = false;
      }
    });

    if (allFilled) {
      const correctWord = words[currentWordIndex];
      if (assembledWord === correctWord) {
        resultDisplay.textContent = "You win!";
      } else {
        resultDisplay.textContent = "You lose!";
      }
      currentWordIndex++;
      setTimeout(loadWord, 2000);
    }
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
});
