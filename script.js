document.getElementById('generate-words').addEventListener('click', generateWords);

function generateWords() {
  const input = document.getElementById('word-input').value;
  const words = input.split(',').map(word => word.trim());
  const wordContainer = document.getElementById('word-container');
  wordContainer.innerHTML = ''; // Clear previous words

  words.forEach(word => {
    const wordElement = document.createElement('div');
    wordElement.classList.add('word');
    wordElement.textContent = word;
    wordContainer.appendChild(wordElement);
    makeDraggable(wordElement);
  });
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
