let playing = false
let time = 30
let firstCard = undefined
let secondCard = undefined
let winningPairs = 0
let numberOfCards = 6
let clicks = 0
let darkMode = false

// sleep function
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const cardClick = function ()
  {
    if ($(this).hasClass("flip")) return;
    if (firstCard && secondCard) return;
    if (!playing) return;
    // random number between 1 and 20
    let random = Math.floor(Math.random() * 20) + 1

    clicks++
    $("#moves").text("Moves: " + clicks)
    $(this).toggleClass("flip");
    if (!firstCard)
      firstCard = $(this).find(".front_face")[0]
    else {
      secondCard = $(this).find(".front_face")[0]
      // console.log(firstCard, secondCard);
      if (
        firstCard.src == secondCard.src
      ) {
        // console.log("match")
        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
        firstCard = undefined
        secondCard = undefined
        winningPairs++
        $("#pairs_left").text("Pairs left: " + (numberOfCards/2 - winningPairs))
        setTimeout(() => {  
          if (winningPairs == numberOfCards/2 && playing) {
            alert("You win!")
            playing = false
            location.reload()
          }
        }, 1000)
      } else {
        // console.log("no match")
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip")
          $(`#${secondCard.id}`).parent().toggleClass("flip")
          firstCard = undefined
          secondCard = undefined
        }, 1000)
      }
      
    }
    if (random == 1) {
      alert("POOOOWWWWERRRRRRR UUUUUUUUPPPPPPP")
      // flip all cards over for 1 second
      $(".card").toggleClass("flip")
      setTimeout(() => {
        $(".card").toggleClass("flip")
      }, 1000)
    }
  }

const setup = () => {
  $("#time").text("Time: " + time)
  createCards(numberOfCards)
  $("#dark_mode").on("click", () => {
    if (!darkMode) {
      $("#overlay").css("background-color", "rgba(0, 0, 0, 0.5)")
      $("#dark_mode").text("Light Mode")
      darkMode = true
    }
    else {
      $("#overlay").css("background-color", "rgba(0, 0, 0, 0)")
      $("#dark_mode").text("Dark Mode")
      darkMode = false
    }
  })
  // make easy medium and hard buttons
  const makeButtons = () => {
    const easyButton = $("<button class>").text("Easy").addClass("btn btn-primary").attr("id", "easy")
    const mediumButton = $("<button>").text("Medium").addClass("btn btn-primary").attr("id", "medium")
    const hardButton = $("<button>").text("Hard").addClass("btn btn-primary").attr("id", "hard")
    $("#buttons").append(easyButton, mediumButton, hardButton)
  }
  makeButtons()
  // set the number of cards based on the difficulty
  $("#easy").on("click", () => {
    numberOfCards = 6
    time = 30
    $("#game_grid").css("width", "600px")
    $("#game_grid").css("height", "400px")
    createCards(numberOfCards)
  })
  $("#medium").on("click", () => {
    numberOfCards = 12
    time = 45
    $("#game_grid").css("width", "800px")
    $("#game_grid").css("height", "600px")
    createCards(numberOfCards)
  })
  $("#hard").on("click", () => {
    numberOfCards = 20
    time = 60
    $("#game_grid").css("width", "1000px")
    $("#game_grid").css("height", "800px")
    createCards(numberOfCards)
  })

  $("#pairs").text("Total pairs: " + numberOfCards/2)
  $("#pairs_left").text("Pairs left: " + (numberOfCards/2 - winningPairs))
  $("#moves").text("Moves: " + clicks)

  $(".card").on("click", cardClick)

  $("#reset").on("click", () => {
    location.reload()
  }
  )

  $("#start").on("click", () => {
    playing = true
    tick()
    $("body").css("background-color", "aquamarine")
    $("#start").css("display", "none")
    $('#easy').css("display", "none")
    $('#medium').css("display", "none")
    $('#hard').css("display", "none")
  }
  );
}

$(document).ready(setup)

// asynchronus function to tick time
const tick = async () => {
  while (time > 0) {
    if (!playing) return;
    await sleep(1000)
    time--
    $("#time").text("Time: " + time)
  }
  if (!playing) return;
  $(".card").toggleClass("flip")
  await sleep(1000)
  alert("You lose!")
  playing = false
  location.reload()
}

const createCards = async (numberOfCards) => {
  $("#time").text("Time: " + time)
  firstCard = undefined
  secondCard = undefined
  winningPairs = 0
  clicks = 0
  $("#pairs").text("Total pairs: " + numberOfCards/2)
  $("#pairs_left").text("Pairs left: " + (numberOfCards/2 - winningPairs))
  $("#moves").text("Moves: " + clicks)
  $("#time").text("Time: " + time)
  playing = false
  // get the  game board
  const gameBoard = $("#game_grid")
  // clear the game board
  gameBoard.empty()
  // choose numberOfCards/2 random pokemon
  const pokemon = await getPokemon()
  // create an array of pokemon
  const chosenPokemon = []
  for (let i = 0; i < numberOfCards/2; i++) {
    let randomIndex = Math.floor(Math.random() * pokemon.length)
    const randomPokemon = pokemon[randomIndex]
    chosenPokemon.push(randomPokemon)
    randomIndex = Math.floor(Math.random() * pokemon.length)
    chosenPokemon.push(randomPokemon)
    
  }
  // shuffle the array
  await shuffle(chosenPokemon)
  // create the cards
  for (let i = 0; i < numberOfCards; i++) {
    const imageUrl = await fetch(chosenPokemon[i].url)
      .then(response => response.json())
      .then(data => {
        return data.sprites.other["official-artwork"].front_shiny
      })
    
    const card = $("<div>").addClass("card")
    const frontFace = $("<img>").addClass("front_face").attr("src", imageUrl, "alt", "").attr("id", "img"+i)
    const backFace = $("<img>").addClass("back_face").attr("src", "back.webp", "alt", "")
    switch (numberOfCards) {
      case 6:
        card.css("width", 33.33 + "%", "height", 50 + "%")
        break;
      case 12:
        card.css("width", 25 + "%" , "height", 33.33 + "%")
        break;
      case 20:
        card.css("width", 20 + "%", "height", 25 + "%")
        break;
      default:
        break;
    }
    card.on("click", cardClick)
    card.append(frontFace, backFace)
    gameBoard.append(card)
  }
}
const shuffle = async (array) => {
  for (let i = 0; i < array.length; i++) {
    const randomIndex = Math.floor(Math.random() * array.length)
    const randomElement = array[randomIndex]
    const currentElement = array[i]
    array[i] = randomElement
    array[randomIndex] = currentElement
  }
  return array
}

const getPokemon = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const data = await response.json()
  return data.results
}

