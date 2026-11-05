const wordBank = {
    Animals: [
        { word: "ELEPHANT", hint: "The largest land animal." },
        { word: "GIRAFFE", hint: "An animal with a very long neck." },
    ],
    Countries: [
        { word: "CAMEROON", hint: "A Central African country called Africa in miniature." },
        { word: "CANADA", hint: "A country famous for its maple leaf." }
    ],
    Technology: [
        { word: "COMPUTER", hint: "An electronic device used for processing data." },
        { word: "DATABASE", hint: "An organized collection of information." },
    ],
    Food: [
        { word: "SPAGHETTI", hint: "A long, thin type of pasta." },
        { word: "SANDWICH", hint: "Food placed between slices of bread." }
    ],
};

let selectedWord = "";
let selectedHint = "";
let selectedCategory = "";
let guessedLetters = [];
let wrongGuesses = 0;
let wins = 0;
let losses = 0;
const maximumAttempts = 6;

const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("letter-keyboard");
const categoryName = document.getElementById("category-name");
const attemptsDisplay = document.getElementById("attempts-left");
const hintButton = document.getElementById("hint-button");
const newGameButton = document.getElementById("new-game-button");
const hintDisplay = document.getElementById("hint-display");
const gameMessage = document.getElementById("game-message");
const difficultySelect = document.getElementById("difficulty-level");


const drawingParts = [
    "head",
    "body",
    "left-arm",
    "right-arm",
    "left-leg",
    "right-leg"
];

function startGame() {
    guessedLetters = [];
    wrongGuesses = 0;
    hintDisplay.textContent = "Hint display";
    gameMessage.textContent = "Good luck! Can you escape the Word Trap?";
    hintButton.disabled = false;
    resetDrawing();
    chooseWord();
    displayWord();
    createKeyboard();
    updateAttempts();
}
// SELECTING A RANDOM WORD
function chooseWord() {
    const categories = Object.keys(wordBank);
    selectedCategory =
        categories[Math.floor(Math.random() * categories.length)];
    const categoryWords = wordBank[selectedCategory];
    const difficulty = difficultySelect.value;
    let filteredWords;
    if (difficulty === "easy") {
        filteredWords = categoryWords.filter(item => item.word.length <= 6);
    } else if (difficulty === "medium") {
        filteredWords = categoryWords.filter(item =>
            item.word.length >= 5 && item.word.length <= 8
        );
    } else {
        filteredWords = categoryWords.filter(item => item.word.length >= 7);
    }
    // Use the full category if no words match the selected difficulty
    if (filteredWords.length === 0) {
        filteredWords = categoryWords;
    }
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    selectedWord = filteredWords[randomIndex].word;
    selectedHint = filteredWords[randomIndex].hint;
    categoryName.textContent = selectedCategory;
}
// DISPLAYING THE HIDDEN WORD
function displayWord() {
    wordDisplay.innerHTML = "";
    for (let letter of selectedWord) {
        const letterSlot = document.createElement("span");
        letterSlot.classList.add("letter-slot");
        letterSlot.textContent =
            guessedLetters.includes(letter) ? letter : "";
        wordDisplay.appendChild(letterSlot);
    }
}

// CREATING THE ALPHABET KEYBOARD
function createKeyboard() {
    keyboard.innerHTML = "";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let letter of alphabet) {
        const button = document.createElement("button");
        button.textContent = letter;
        button.classList.add("key-button");
        button.type = "button";
        button.addEventListener("click", function () {
            checkLetter(letter, button);
        });
        keyboard.appendChild(button);
    }
}
// CHECKING THE PLAYER'S GUESS

function checkLetter(letter, button) {
    if (guessedLetters.includes(letter) || wrongGuesses >= maximumAttempts) {
        return;
    }
    if (gameMessage.textContent.includes("YOU WIN") ||
        gameMessage.textContent.includes("GAME OVER")) {
        return;
    }
    guessedLetters.push(letter);
    button.disabled = true;
    if (selectedWord.includes(letter)) {
        displayWord();
        checkWin();
    } else {
        wrongGuesses++;
        showDrawing();
        updateAttempts();
        if (wrongGuesses >= maximumAttempts) {
            endGame(false);
        }
    }
}
// SHOWING THE HANGMAN DRAWING
function showDrawing() {
    const part = drawingParts[wrongGuesses - 1];
    document.getElementById(part).style.display = "block";
}
// RESETTING THE DRAWING
function resetDrawing() {
    drawingParts.forEach(part => {
        document.getElementById(part).style.display = "none";
    });
}
// UPDATING REMAINING ATTEMPTS
function updateAttempts() {
    attemptsDisplay.textContent =
        maximumAttempts - wrongGuesses;
}
// CHECKING IF THE PLAYER HAS WON
function checkWin() {
    const hasWon = [...selectedWord].every(letter =>
        guessedLetters.includes(letter)
    );
    if (hasWon) {
        endGame(true);
    }
}
// ENDING THE GAME
function endGame(won) {
    const keyboardButtons = keyboard.querySelectorAll("button");
    keyboardButtons.forEach(button => {
        button.disabled = true;
    });
    hintButton.disabled = true;
    if (won) {
        wins++;
        score += 10;
        gameMessage.textContent =
            "YOU WIN! Excellent work. You escaped the Word Trap!";
    } else {
        losses++;
        gameMessage.textContent =
            "GAME OVER! The hidden word was " + selectedWord + ".";
        displayWord();
    }
    scoreDisplay.textContent = score;
}
// HINT FUNCTION
function showHint() {
    if (hintButton.disabled) {
        return;
    }
    hintDisplay.textContent = "HINT: " + selectedHint;
    hintButton.disabled = true;
}

newGameButton.addEventListener("click", startGame);
hintButton.addEventListener("click", showHint);
difficultySelect.addEventListener("change", startGame);

document.addEventListener("keydown", function(event) {
    const letter = event.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
        const buttons = keyboard.querySelectorAll("button");
        buttons.forEach(button => {
            if (button.textContent === letter && !button.disabled) {
                button.click();
            }
        });
    }
});
