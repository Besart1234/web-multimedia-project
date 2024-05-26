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

function shuffle(array){
    array.sort(() => Math.random() - 0.5);
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
