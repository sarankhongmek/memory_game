/*
 * Create a list that holds all of matched cards
 */
var matchedCards = [];

/*
 * declaring var
 */
var reset = document.querySelector('.restart');
var moveCounter = document.querySelector('.moves');
var timerCounter = document.querySelector('.timer');
var timer;
var stars = document.querySelectorAll('ul.stars li i');
var moves = 0;
var openCards = [];
var time = 0;
var star = 3;



//Update timer
function runTimer(){
      time++;
      timerCounter.innerText = convertTimer(time);
}




//Function to conver time to mins and seconds
function convertTimer(s){
  var min = Math.floor(s / 60);
  var sec = s % 60;
  seconds = '' + sec;
  if(seconds.length < 2){
    return min + ':' + '0' + seconds;
  } else {
    return min + ':' + sec;
  }
}


/*
 *
 Create a list that holds all of the cards
 */

var cards = ['fa-diamond','fa-diamond',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-bolt','fa-bolt',
            'fa-cube','fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb'];

//generrate card
function generateCard(card){
  return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></l>` ;
}




/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

function initGame (){
  var deck = document.querySelector('.deck');
  var moveCounter = document.querySelector('.moves');
  var cardHTML = '';
  matchedCards = [];
  openCards = [];
  var cardHTML = shuffle(cards).map(function(card){
    return generateCard(card);
  });

  //reset time,moves and stars,start timer
  moves = 0;
  moveCounter.innerText = moves;
  deck.innerHTML = cardHTML.join('');
  time = 0;
  timerCounter.textContent = `0:00`;
  stars[0].classList.add('fa-star');
  stars[1].classList.add('fa-star');
  stars[2].classList.add('fa-star');
  if(!timer){
    timer = setInterval(runTimer,1000);

  } else {
    clearTimer(timer);
    timer = undefined

  }
}


//start game
initGame();
addEvt();



function addEvt(){
  var allCards = document.querySelectorAll('.card');
  allCards.forEach(function(card){
    card.addEventListener('click', function(e){
      //Open a card and add to array, if a card is clicked on and openCards < 2
      if (card.classList.contains('card') && openCards.length < 2){

        if(!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
          openCards.push(card);
          card.classList.add('open','show');



          //if two cards in array
          if (openCards.length === 2) {

                //if match
                if(openCards[0].dataset.card == openCards[1].dataset.card){
                  openCards[0].classList.add('match','open','show');
                  openCards[0].classList.add('correct');
                  matchedCards.push(openCards[0]);


                  openCards[1].classList.add('match','open','show');
                  openCards[1].classList.add('correct');
                  matchedCards.push(openCards[1]);
                  $('.correct').addClass('animated bounce');
                  openCards = [];
                  if (matchedCards.length === 16 ){
                      clearTimer();
                      gameOver();
                  }


                } else {
                  //if no match hide
                  openCards[0].classList.add('incorrect');
                  openCards[1].classList.add('incorrect');
                  $('.incorrect').addClass('animated shake');
                    setTimeout(function() {
                      openCards.forEach(function (card){
                        $('.incorrect').removeClass('animated shake');
                        openCards[0].classList.remove('incorrect');
                        openCards[1].classList.remove('incorrect');
                        card.classList.remove('open','show');
                      });
                      openCards = [];
                    },1000);

              }
                //increment moves
                moves += 1;
                moveCounter.innerText = moves;
                removestar();


          }
        }
      }
      });
  });
}


//Display user score and time and call clearInterval();
function gameOver(){
  //16 cars game is won
  //sweetalert message

  swal({  type: "success",
          title:'Congratulations! You Won!',
          text:'With ' + moves +' Moves and ' + star + ' Stars in ' + timerCounter.innerText + ' Time.' ,
          confirmButtonText:'Play again!',
      }).then(()=> {

             //execute initGame and addEvt
             initGame();
             addEvt();
             timer = setInterval(runTimer,1000);

        })
}



//Function to check if user moves and then remove stars
function removestar() {
  if (moves === 13){
    stars[0].classList.remove('fa-star');
    star -= 1;
  } else if ( moves === 17){
    stars[1].classList.remove('fa-star');
    star -= 1;
  } else if ( moves === 20){
    stars[2].classList.remove('fa-star');
    star -= 1;
  }
}


//stop timer
function clearTimer(){
  clearInterval(timer);
}


//restart game button
reset.addEventListener('click', function(e){
  initGame();
  addEvt();
});
