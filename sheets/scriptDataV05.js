const innPrice = document.querySelector("#txt-price");
const innCurrentBlock = document.querySelector("#txt-current-block");
const innToHalving = document.querySelector("#txt-to-halving");
const innBlockReward = document.querySelector("#txt-block-reward")
const innDailyZec = document.querySelector("#txt-daily-zec")
const innInflation = document.querySelector("#txt-inflation");
const innDifficulty = document.querySelector("#txt-difficulty");
const innTimer = document.querySelector("#txt-timer");
const innTimeToHalving = document.querySelector("#txt-time-to-halving");

const url = "https://api.blockchair.com/zcash/stats";

const maxSupply = 21000000;
const blockReward = 3.125;
const blocksPerDay = 1152;
const blocksPerYear = blocksPerDay * 365;
const halvingBlock = 2726400;
const dailyZec = blocksPerDay * blockReward;
const yearlyZec = blocksPerYear * blockReward;
const inflationRate = (yearlyZec / maxSupply) * 100;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const price = data.data.market_price_usd;
    const blockHeight = data.data.blocks;
    const difficulty = data.data.difficulty;
    const blocksToHalving = halvingBlock - blockHeight;
    
    const timeToHalving = blocksToHalving * 75;
    const countDownDate = new Date().getTime() + (timeToHalving * 1000);
    
    function updateData() {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      let seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, "0");

      innTimer.innerHTML = `Next halving in: <br> ${days}d ${hours}h ${minutes}m ${seconds}s`;
      innTimeToHalving.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      innPrice.innerHTML = '$' + price;
      innBlockReward.innerHTML = blockReward.toLocaleString('en-US') + ' ZEC';
      innDailyZec.innerHTML = dailyZec.toLocaleString('en-US') + ' ZEC';
      innInflation.innerHTML = inflationRate.toFixed(2) + '%';
      innToHalving.innerHTML = blocksToHalving.toLocaleString('en-US');
      innDifficulty.innerHTML = difficulty.toLocaleString('en-US');
      innCurrentBlock.innerHTML = blockHeight.toLocaleString('en-US');

      if (distance < 0) {
        clearInterval(x);
        innTimer.innerHTML = "Remember to @Olek97 on telegram to update the countdown.";
      } else {
        requestAnimationFrame(updateData);
      }
    }
    updateData();
  })
  .catch((error) => console.log(error));