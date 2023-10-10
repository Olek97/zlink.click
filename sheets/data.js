const innHTML = {
  innPrice: document.querySelector("#txt-price"),
  innCurrentBlock: document.querySelector("#txt-current-block"),
  innToHalving: document.querySelector("#txt-to-halving"),
  innBlockReward: document.querySelector("#txt-block-reward"),
  innDailyZec: document.querySelector("#txt-daily-zec"),
  innInflation: document.querySelector("#txt-inflation"),
  innDifficulty: document.querySelector("#txt-difficulty"),
  innTimer: document.querySelector("#txt-timer"),
  innHalvingDate: document.querySelector("#txt-halving-date"),
  innMempool: document.querySelector("#txt-mempool")
};

const url = "https://api.blockchair.com/zcash/stats";

const previousHalvingBlock = 1046400;
const nextHalvingBlock = 2726400;
const maxSupply = 21000000;
const blockReward = 3.125;
const blocksPerDay = 1152;
const blocksPerYear = blocksPerDay * 365;
const dailyZec = blocksPerDay * blockReward;
const yearlyZec = blocksPerYear * blockReward;
const inflationRate = (yearlyZec / maxSupply) * 100;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const price = data.data.market_price_usd;
    const currentBlock = data.data.blocks;
    const difficulty = data.data.difficulty;
    const mempool = data.data.mempool_transactions;
    const blocksToHalving = nextHalvingBlock - currentBlock;
    const secsToHalving = blocksToHalving * 75;
    const countDownDate = new Date().getTime() + secsToHalving * 1000;

    function updateData() {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      let seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, "0");

      innHTML.innTimer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s to go`;
      innHTML.innHalvingDate.innerHTML = new Date(countDownDate).toDateString();
      innHTML.innPrice.innerHTML = "$" + price;
      innHTML.innBlockReward.innerHTML = blockReward.toLocaleString("en-US") + " ZEC";
      innHTML.innDailyZec.innerHTML = dailyZec.toLocaleString("en-US") + " ZEC";
      innHTML.innInflation.innerHTML = inflationRate.toFixed(2) + "%";
      innHTML.innToHalving.innerHTML = blocksToHalving.toLocaleString("en-US");
      innHTML.innDifficulty.innerHTML = difficulty.toLocaleString("en-US");
      innHTML.innCurrentBlock.innerHTML = currentBlock.toLocaleString("en-US");
      innHTML.innMempool.innerHTML = mempool.toLocaleString("en-US");

      if (distance <= 0) {
        clearInterval(x);
        innHTML.innTimer.innerHTML = "Reach @Olek97 on telegram to update the countdown.";
      } else {
        requestAnimationFrame(updateData);
      }
    }
    updateData();
  })
  .catch((error) => {
    console.error(error);
  });