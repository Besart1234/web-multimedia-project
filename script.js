const cardsContainer = document.querySelector(".cards-grid");

const cardImages = [
    "assets/images/1.jpg", 
    "assets/images/2.jpg", 
    "assets/images/3.jpg", 
    "assets/images/4.jpg", 
    "assets/images/5.jpg", 
    "assets/images/6.jpg",
    "assets/images/7.jpg",
    "assets/images/8.jpg",
    "assets/images/9.jpg",
    "assets/images/10.jpg", 
    "assets/images/1.jpg", 
    "assets/images/2.jpg", 
    "assets/images/3.jpg", 
    "assets/images/4.jpg", 
    "assets/images/5.jpg", 
    "assets/images/6.jpg",
    "assets/images/7.jpg",
    "assets/images/8.jpg",
    "assets/images/9.jpg",
    "assets/images/10.jpg" 
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

let timerElement = document.getElementById("timer");
let movesElement = document.getElementById("moves");
let restartBtn = document.getElementById("restart-btn");
let timer;
let time = 0, moves = 0, misses = 0;  
let hasStarted = false;
let matchedPairs = 0;
let numCards;

const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const winSound = document.getElementById("win-sound");

flipSound.volume = 0.2;
matchSound.volume = 0.2;
winSound.volume = 0.3;

function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}

function startTimer(){
    timer = setInterval(() => {
        time++;
        timerElement.textContent = `Time: ${time}`;
    }, 1000);
}

function stopTimer(){
    clearInterval(timer);
}

function incrementMoves(){
    moves++;
    movesElement.textContent = `Moves: ${moves}`;
}

function incrementMisses(){
    misses++;
}

function resetGame(){
    time = 0;
    moves = 0;
    misses = 0;
    matchedPairs = 0;
    hasStarted = false;
    timerElement.textContent = "Time: 0";
    movesElement.textContent = "Moves: 0";
    clearInterval(timer);
    cardsContainer.innerHTML = "";
    createCards();
}

function createCards(){
    numCards = parseInt(localStorage.getItem("numCards"));
    const selectedImages = []; // this holds the selected images

    while(selectedImages.length < numCards){
        const randomImage = cardImages[Math.floor(Math.random() * cardImages.length)]; //Select a random image from cardImages

        if(!selectedImages.includes(randomImage)){ //If the image is not already in the selectedImages, add it twice to form a pair
            selectedImages.push(randomImage, randomImage);
        }
    }

    shuffle(selectedImages); //Shuffle the array to randomize the card order

    const gridSizes = {
        12: {columns: 4, rows: 3},
        16: {columns: 4, rows: 4},
        20: {columns: 5, rows: 4}
    };

    const totalWidth = 830;
    const totalHeight = 440;
    const gap = 10;

    const cardWidth = (totalWidth - (gridSizes[numCards].columns - 1) * gap) / gridSizes[numCards].columns;
    const cardHeight = (totalHeight - (gridSizes[numCards].rows - 1) * gap) / gridSizes[numCards].rows;

    cardsContainer.style.gridTemplateColumns = `repeat(${gridSizes[numCards].columns}, ${cardWidth}px)`;
    cardsContainer.style.gridTemplateRows = `repeat(${gridSizes[numCards].rows}, ${cardHeight}px)`;
    cardsContainer.style.gap = `${gap}px`;

    selectedImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <img class="card-image" src="${image}" alt="Card Image">
            </div>
            <div class="card-back"></div>
        </div>`; 
        card.addEventListener('click', flipCard);  
        cardsContainer.appendChild(card);  
    });
}

//---------------------------------------------------------------

let hasFlippedCard = false;
let firstCard, secondCard;

function flipCard() {
    if (this === firstCard) return;

    this.classList.add('flipped');
    playSound(flipSound);

    if(!hasStarted){
        hasStarted = true;
        startTimer();
    }

    //incrementMoves(); calling the function here increments moves for every card flip

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    incrementMoves(); // increment moves here, after the second card is flipped
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.querySelector('.card-image').src === secondCard.querySelector('.card-image').src;

    //isMatch ? disableCards() : unflipCards();
    if(isMatch){
        disableCards();
        setTimeout(() => {
            playSound(matchSound);
        }, 1500);
    }
    else{
        incrementMisses();
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;
    
    if(matchedPairs == numCards / 2){
        stopTimer();
        setTimeout(() => {
            playSound(winSound);
        }, 2800);
        updateStats();
    }
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, firstCard, secondCard] = [false, null, null];
}


function updateStats(){
    let stats = JSON.parse(localStorage.getItem("stats")) || [] ;
    stats.push(`Time: ${time}, Moves: ${moves}, Misses: ${misses}`);
    localStorage.setItem("stats", JSON.stringify(stats));
}

let loader = document.getElementById("preloader");

window.addEventListener("load", () => {
    setTimeout(() => { //used the setTimeout here because otherwise the preloader was almost impossible to notice since the page loads too fast
        loader.style.display = "none";
    }, 600);
});

createCards();
restartBtn.addEventListener('click', resetGame);