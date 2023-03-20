// Site's last update date
const xhr = new XMLHttpRequest();
xhr.open("HEAD", window.location.href, true);
xhr.onreadystatechange = () => {
  if (xhr.readyState === xhr.DONE) {
    const lastModified = new Date(xhr.getResponseHeader("Last-Modified"));
    document.getElementById("last-update").innerHTML = `Site updated on ${lastModified.toLocaleDateString()}`;
  }
};
xhr.send();

// Clear user's cache after reload
window.addEventListener("load", function () {
  document.querySelectorAll('link[rel="stylesheet"], img, script').forEach(function (el) {
    el.setAttribute("cache-control", "no-cache, no-store, must-revalidate");
    el.setAttribute("pragma", "no-cache");
    el.setAttribute("expires", "0");
  });
});

// Zcash's data
const url = "https://api.blockchair.com/zcash/stats";

const maxSupply = 21000000;
const blockReward = 3.125;
const blocksPerDay = 1152;
const blocksPerYear = blocksPerDay * 365;
const halvingBlock = 2726400;
const newSupply = blocksPerYear * blockReward;
const inflationRate = (newSupply / maxSupply) * 100;
console.log(inflationRate.toFixed(2) + '%');

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const blockHeight = data.data.blocks;
    const blocksToHalving = halvingBlock - blockHeight;
    const timeToHalving = blocksToHalving * 75;

    let countDownDate = new Date().getTime() + (timeToHalving * 1000);
    let pTag = document.getElementById("big-timer");

    function updateTimer() {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      let seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, "0");

      pTag.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s to halving.`;

      if (distance < 0) {
        clearInterval(x);
        pTag.innerHTML = "Remember to @Olek97 on telegram to update the countdown.";
      } else {
        requestAnimationFrame(updateTimer);
      }
    }
    updateTimer();
  })
  .catch((error) => console.log(error));

// Second level div Info
const actionBtn = () => {
  const nav = document.getElementById('divInfo');
  if (nav.style.width > '1%') {
      nav.style.width = '0';
  } else {
      nav.style.width = '100%';
  }
}


