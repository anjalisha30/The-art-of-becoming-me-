
const exploreBtn = document.getElementById("exploreBtn");
const thoughts = document.getElementById("thoughts");
const planet = document.getElementById("planet");
const quote = document.getElementById("quote");
const quoteBtn = document.getElementById("quoteBtn");

const quotes = [
    "Maybe loving yourself means learning to stay by your own side, even on the days you don't particularly like yourself.",

    "I spent so much time trying to become someone people could love that I forgot to ask whether I loved the person I was becoming.",

    "I am allowed to be a work in progress and still be proud of how far I've come.",

    "Somewhere between who I was and who I want to become, I am learning to appreciate who I am.",

    "I don't want to spend my entire life becoming someone else just to be accepted by people who never understood me.",

    "Maybe healing is not becoming the person you were before everything happened. Maybe it's meeting the person you are now and learning to love her.",

    "I want to build a life that feels like mine, not just one that looks good to everyone else.",

    "I am allowed to outgrow the things I once thought I couldn't live without."
];

let currentQuote = 0;

exploreBtn.addEventListener("click", () => {
    thoughts.scrollIntoView({
        behavior: "smooth"
    });
});

quoteBtn.addEventListener("click", () => {
    currentQuote = (currentQuote + 1) % quotes.length;
    quote.textContent = quotes[currentQuote];
});


// 💌 LETTERS TO MYSELF — Open and close each letter

document.querySelectorAll(".letter-card").forEach((card) => {
const button = card.querySelector(".open-letter");
const letter = card.querySelector(".letter-content");


if (!button || !letter) {
    console.warn("Letter button or content is missing:", card);
    return;
}

button.addEventListener("click", () => {
    const isOpen = card.classList.toggle("is-open");

    letter.style.display = isOpen ? "block" : "none";

    button.textContent = isOpen
        ? "Close my letter ↑"
        : "Open my letter ↗";

    button.setAttribute("aria-expanded", String(isOpen));
});

button.setAttribute("aria-expanded", "false");

});
