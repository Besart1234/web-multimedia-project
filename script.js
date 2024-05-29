const cardsContainer = document.querySelector(".cards-grid");

const cardImages = [
    "assets/images/1.jpg", 
    "assets/images/2.jpg", 
    "assets/images/3.jpg", 
    "assets/images/4.jpg", 
    "assets/images/5.jpg", 
    "assets/images/6.jpg", 
    "assets/images/1.jpg", 
    "assets/images/2.jpg", 
    "assets/images/3.jpg", 
    "assets/images/4.jpg", 
    "assets/images/5.jpg", 
    "assets/images/6.jpg" 
];

/*function shuffle(array){
    array.sort(() => Math.random() - 0.5);
}*/

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
let time = 0, moves = 0;  
let hasStarted = false;
let matchedPairs = 0;

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

function resetGame(){
    time = 0;
    moves = 0;
    matchedPairs = 0;
    hasStarted = false;
    timerElement.textContent = "Time: 0";
    movesElement.textContent = "Moves: 0";
    clearInterval(timer);
    cardsContainer.innerHTML = "";
    createCards();
}

function createCards(){
    shuffle(cardImages);

    cardImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
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

    if(!hasStarted){
        hasStarted = true;
        startTimer();
    }

    incrementMoves();

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.querySelector('.card-image').src === secondCard.querySelector('.card-image').src;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedPairs++;
    
    if(matchedPairs == cardImages.length / 2){
        stopTimer();
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

createCards();
restartBtn.addEventListener('click', resetGame);