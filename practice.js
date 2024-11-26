// Javascript Promises- Asynchronous Code (async/await)

const container = document.querySelector(".container");

// ===========================================
// PART 1: STEP 1
// ===========================================
async function getNumberFact(num) {
  let baseURL = "http://numbersapi.com";
  try {
    const { data: n } = await axios.get(`${baseURL}/${num}?json`);
    console.log(n.text);
  } catch {
    console.log("Error");
  }
}

// ===========================================
// PART 1: STEP 2
// ===========================================
async function getMultiNumbers() {
  let baseURL = "http://numbersapi.com";
  const favNumbers = [1, 2, 3];
  try {
    const { data } = await axios.get(`${baseURL}/${favNumbers}?json`);
    for (let number in data) {
      const fact = data[number];
      console.log(fact);
    }
  } catch {
    console.log("Error");
  }
}

// ===========================================
// PART 1: STEP 3 Use the API to get 4 facts on
// your favorite number. Once you have them all,
// put them on the page. It’s okay if some of
// the facts are repeats.
// ===========================================
// TODO
async function promisesAll() {
  const baseURL = "http://numbersapi.com";

  try {
    let promises = await Promise.all(
      Array.from({ length: 4 }, () => {
        return axios.get(`${baseURL}/22?json`);
      })
    );

    promises.forEach((promise) => {
      const el = document.createElement("p");
      el.innerText = promise.data.text;
      container.appendChild(el);
    });
  } catch {
    console.log("error");
  }
}

// ===========================================
// PART 2: STEP 1
// Make a request to the Deck of Cards
// API to request a single card from a newly
// shuffled deck. Once you have the card,
// console.log the value and the suit (e.g. “5
// of spades”, “queen of diamonds”).
// ===========================================

async function drawOneCard() {
  const baseURL = "https://deckofcardsapi.com/api/deck";
  try {
    const resp = await axios.get(`${baseURL}/new/draw/?count=1`);
    const card = resp.data.cards[0];
    console.log(`${card.value} of ${card.suit}`);
  } catch {
    console.log("Error");
  }
}

// ===========================================
// PART 2:
// 2. Make a request to the deck of cards API to
// request a single card from a newly shuffled
// deck. Once you have the card, make a request
// to the same API to get one more card from
// the **same** deck.

//    Once you have both cards, ***console.
//    log*** the values and suits of both cards.
// ===========================================

async function drawTwoCards() {
  const baseURL = "https://deckofcardsapi.com/api/deck";
  try {
    // Draw the first card from a new shuffled deck
    const resp1 = await axios.get(`${baseURL}/new/draw/?count=1`);
    const deckId = resp1.data.deck_id;

    // Draw the second card from the same deck
    const resp2 = await axios.get(`${baseURL}/${deckId}/draw/?count=1`);

    // Extract card details
    const card1 = resp1.data.cards[0];
    const card2 = resp2.data.cards[0];

    console.log(`${card1.value} of ${card1.suit}`);
    console.log(`${card2.value} of ${card2.suit}`);
  } catch (err) {
    console.log("Error: ", err);
  }
}

// ===========================================
// PART 2:
// 3. Build an HTML page that lets you draw
// cards from a deck. When the page loads, go to
// the Deck of Cards API to create a new deck,
// and show a button on the page that will let
// you draw a card. Every time you click the
// button, display a new card, until there are
// no cards left in the deck.
// ===========================================

let baseURL = "https://deckofcardsapi.com/api/deck";
let deckId;
// Create a new deck when page loads.
document.addEventListener("DOMContentLoaded", () => {
  createNewDeck();

  // Click a button to draw a card.
  document.querySelector(".btn").addEventListener("click", async () => {
    if (!deckId) {
      console.error("Error when creating deck.");
    }

    try {
      const resp = await axios.get(`${baseURL}/${deckId}/draw/?count=1`);

      // Disable the draw btn when no cards left.
      if (resp.data.remaining === 0) {
        document.querySelector(".btn").classList.add("d-none");
        alert("No more cards left in the deck.");
        return;
      }
      const card = resp.data.cards[0];
      console.log(card);

      console.log(`${card.value} of ${card.suit}`);
      const img = document.createElement("img");
      img.src = card.image;

      // apply a slight random rotation and translate for each card
      const deg = Math.random() * 90 - 45;
      const offSetX = Math.random() * 90 - 45;
      const offSetY = Math.random() * 45;
      img.style.position = "absolute";
      img.style.transform = `translate(${offSetX}px, ${offSetY}px) rotate(${deg}deg)`;

      document.querySelector(".card-display").appendChild(img);
    } catch (err) {
      console.log("Error: ", err);
    }
  });
});

async function createNewDeck() {
  try {
    const resp = await axios.get(`${baseURL}/new/shuffle/?deck_count=1`);
    deckId = resp.data.deck_id;
  } catch (err) {
    console.log("Error: ", err);
  }
}
