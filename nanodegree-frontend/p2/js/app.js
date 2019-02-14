/*
 * Global variables
 */
 const MAX_NUMBER_OF_MATCHES = 8;

 let timer;
 let seconds = 0;
 let moves = 0;
 let numberOfMatches = 0;
 let openCards = 0;
 let openCardsArray = [];

 let scoreModal = document.querySelector("#score-modal");
 let movesLabels = document.querySelectorAll(".moves");
 let minutesTxts = document.querySelectorAll(".minutes");
 let secondsTxts = document.querySelectorAll(".seconds");
 let deck = document.querySelector(".deck");
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Updates cards on deck when page is loaded
 document.addEventListener("DOMContentLoaded", function(event) {
   startNewGame();
 });


// Added event listener on restart button
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', function () {
  clearTimeout(timer);
  startNewGame();
});

// Removes all cards from deck
function removeAllCards(cardsList){
  for(const card of cardsList){
    card.remove();
  }
}

// Display cards on deck
function displayNewCards(cardsArray){
  for (var i = 0; i < cardsArray.length; i++){
    cardsArray[i].classList.remove('match');
    cardsArray[i].classList.remove('open');
    cardsArray[i].classList.remove('show');
    deck.appendChild(cardsArray[i]);
  }
}

// Updates cards list for new game when page loads or when clicking on restart button
function resetCards(){
  let cardsList = document.querySelectorAll(".card");
  let cardsArray = Array.prototype.slice.call(cardsList);
  cardsArray = shuffle(cardsArray);
  openCards = 0;
  openCardsArray = [];
  numberOfMatches = 0
  removeAllCards(cardsList);
  displayNewCards(cardsArray);
}

function startNewGame(){
  resetCards();
  resetMoves();
  resetTimerDisplay();
  timer = setInterval(() => { updateTimer()
  }, 1000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function resetTimerDisplay(){
  seconds = 0;
  updateMinutesDisplay("00");
  updateSecondsDisplay("00");
}
function updateMinutesDisplay(minStr){
  for(const minutesTxt of minutesTxts){
    minutesTxt.innerText = minStr;
  }
}
function updateSecondsDisplay(secStr){
  for(const secondsTxt of secondsTxts){
    secondsTxt.innerText = secStr;
  }
}
function updateTimer(){
  seconds++;
  if(seconds < 60){
    if(seconds<10)
      updateSecondsDisplay("0" + seconds.toString());
    else
      updateSecondsDisplay(seconds.toString());
  }
  else{
      let secondsTimer = seconds%60;
      updateMinutesDisplay(Math.floor(seconds/60).toString());
      if(secondsTimer<10)
        updateSecondsDisplay("0" + secondsTimer.toString());
      else
        updateSecondsDisplay((secondsTimer).toString());
  }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 function resetMoves(){
   moves = 0;
   for(const movesLabel of movesLabels){
     movesLabel.innerText = "0";
   }
 }

 function updateMoves(){
   moves++;
   for(const movesLabel of movesLabels){
     movesLabel.innerText = moves;
   }
 }

 function hideCards(){
   openCardsArray[0].classList.remove('no-match');
   openCardsArray[1].classList.remove('no-match');
   openCards = 0;
   openCardsArray = [];
 }

 function setMatch(){
   numberOfMatches++;
   openCardsArray[0].classList.remove('open');
   openCardsArray[0].classList.remove('show');
   openCardsArray[1].classList.remove('open');
   openCardsArray[1].classList.remove('show');
   openCardsArray[0].classList.add('match');
   openCardsArray[1].classList.add('match');
   openCards = 0;
   openCardsArray = [];
   // check if game was won
   if(numberOfMatches == MAX_NUMBER_OF_MATCHES){
      scoreModal.style.display = "block";
      clearTimeout(timer);
   }
 }

 function setNoMatch(){
   openCardsArray[0].classList.remove('open');
   openCardsArray[0].classList.remove('show');
   openCardsArray[1].classList.remove('open');
   openCardsArray[1].classList.remove('show');
   openCardsArray[0].classList.add('no-match');
   openCardsArray[1].classList.add('no-match');

   setTimeout(() => { hideCards()
   }, 1500);
 }

 function checkMatch(){
   if(openCardsArray[0].firstElementChild.className.includes(openCardsArray[1].firstElementChild.className)){
     setMatch();
   }
   else {
     setNoMatch();
   }
   updateMoves();
 }

 // Decide which action to take on card click
 function evaluateCard(card){
   if ((!(card.className.includes("open")) && !(card.className.includes("match")) && (openCards < 2))){
     openCards++;
     card.className += " open show";
     openCardsArray.push(card);
   }
   if(openCards == 2){
     checkMatch();
   }
 }

 deck.addEventListener('click', function(event) {
   if(event.target.nodeName == 'I'){
     evaluateCard(event.target.parentNode);
   }else if(event.target.nodeName == 'LI'){
     evaluateCard(event.target);
   }
 });

/*
*  Setting score modal buttons behaviors
*/
// hide score modal
let btnModalClose = document.querySelector(".btn-modal-close");
btnModalClose.addEventListener('click', function(event)
{
  scoreModal.style.display = "none";
});

// hide score modal and restart game
let btnModalRestart = document.querySelector(".btn-modal-restart");
btnModalRestart.addEventListener('click', function(event)
{
  scoreModal.style.display = "none";
  startNewGame();
});
