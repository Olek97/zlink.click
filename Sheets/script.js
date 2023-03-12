const xhr = new XMLHttpRequest();
xhr.open("HEAD", window.location.href, true);
xhr.onreadystatechange = () => {
  if (xhr.readyState === xhr.DONE) {
    const lastModified = new Date(xhr.getResponseHeader("Last-Modified"));
    document.getElementById("last-update").innerHTML = `Site updated on ${lastModified.toLocaleDateString()}`;
  }
};
xhr.send();

window.addEventListener("load", function () {
  document.querySelectorAll('link[rel="stylesheet"], img, script').forEach(function (el) {
    el.setAttribute("cache-control", "no-cache, no-store, must-revalidate");
    el.setAttribute("pragma", "no-cache");
    el.setAttribute("expires", "0");
  });
});

const url = "https://api.blockchair.com/zcash/stats";

const maxSupply = 21000000;
const blocksPerDay = 1152;
const halvingBlock = 2726400;

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


