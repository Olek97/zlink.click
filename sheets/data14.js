const innHTML = {
  innPrice: document.querySelector("#txt-price"),
  innMarketCap: document.querySelector("#txt-market-cap"),
  innDiluitedMarketCap: document.querySelector("#txt-diluited-market-cap"),
  innCurrentBlock: document.querySelector("#txt-current-block"),
  innToHalving: document.querySelector("#txt-to-halving"),
  innBlockReward: document.querySelector("#txt-block-reward"),
  innDailyZec: document.querySelector("#txt-daily-zec"),
  innInflation: document.querySelector("#txt-inflation"),
  innDifficulty: document.querySelector("#txt-difficulty"),
  innTimer: document.querySelector("#txt-timer"),
  innHalvingDate: document.querySelector("#txt-halving-date"),
  innMempool: document.querySelector("#txt-mempool"),
  innTransparentPool: document.querySelector("#txt-tpool"),
  innSproutPool: document.querySelector("#txt-zcpool"),
  innSaplingPool: document.querySelector("#txt-zspool"),
  innOrchardPool: document.querySelector("#txt-opool"),
  innTotalSupply: document.querySelector("#txt-total-supply"),
};

const previousHalvingBlock = 1046400;
const nextHalvingBlock = 2726400;
const maxSupply = 21000000;
const blockReward = 3.125;
const blocksPerDay = 1152;
const blocksPerYear = blocksPerDay * 365;
const dailyZec = blocksPerDay * blockReward;
const yearlyZec = blocksPerYear * blockReward;
const inflationRate = (yearlyZec / maxSupply) * 100;

let transparent, sprout, sapling, orchard, totalSupply, currentBlock, difficulty, mempool, blocksToHalving, secsToHalving, countDownDate, price;

const api = [
  "https://api.blockchair.com/zcash/stats",
  "https://corsproxy.io/?" + encodeURIComponent("https://zcashblockexplorer.com/api/v1/blockchain-info"),
  "https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false&precision=5&c"
];

function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error(`API request error: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network error"));
    };

    xhr.send();
  });
}

async function fetchAllData() {
  try {
    const apiData = await Promise.all(api.map(url => fetchData(url)));

    const bhr = apiData[0];
    const zbe = apiData[1];
    const cgk = apiData[2];

    currentBlock = bhr.data.blocks;
    difficulty = bhr.data.difficulty;
    mempool = bhr.data.mempool_transactions;
    blocksToHalving = nextHalvingBlock - currentBlock;
    secsToHalving = blocksToHalving * 75;
    countDownDate = new Date().getTime() + secsToHalving * 1000;
    transparent = zbe.valuePools[0].chainValue;
    sprout = zbe.valuePools[1].chainValue;
    sapling = zbe.valuePools[2].chainValue;
    orchard = zbe.valuePools[3].chainValue;
    totalSupply = transparent + sprout + sapling + orchard;
    price = cgk.zcash.usd;
    marketCap = price * totalSupply;
    diluitedMarketCap = price * maxSupply;

    innHTML.innHalvingDate.innerHTML = new Date(countDownDate).toDateString();
    innHTML.innPrice.innerHTML = price + " $";
    innHTML.innBlockReward.innerHTML = blockReward.toLocaleString("en-US") + " ZEC";
    innHTML.innDailyZec.innerHTML = dailyZec.toLocaleString("en-US") + " ZEC";
    innHTML.innInflation.innerHTML = inflationRate.toFixed(2) + "%";
    innHTML.innToHalving.innerHTML = blocksToHalving.toLocaleString("en-US");
    innHTML.innDifficulty.innerHTML = difficulty.toLocaleString("en-US");
    innHTML.innCurrentBlock.innerHTML = currentBlock.toLocaleString("en-US");
    innHTML.innMempool.innerHTML = mempool.toLocaleString("en-US") + " TXs";
    innHTML.innTransparentPool.innerHTML = Math.floor(transparent).toLocaleString("en-US") + " ZEC";
    innHTML.innSproutPool.innerHTML = Math.floor(sprout).toLocaleString("en-US") + " ZEC";
    innHTML.innSaplingPool.innerHTML = Math.floor(sapling).toLocaleString("en-US") + " ZEC";
    innHTML.innOrchardPool.innerHTML = Math.floor(orchard).toLocaleString("en-US") + " ZEC";
    innHTML.innTotalSupply.innerHTML = Math.floor(totalSupply).toLocaleString("en-US") + " ZEC";
    innHTML.innMarketCap.innerHTML = Math.floor(marketCap).toLocaleString("en-US") + " $";
    innHTML.innDiluitedMarketCap.innerHTML = Math.floor(diluitedMarketCap).toLocaleString("en-US") + " $";

    function Timer() {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, "0");

      innHTML.innTimer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s to go`;

      if (distance > 0) {
        requestAnimationFrame(Timer);
      } else {
        alert("Reach @Olek97 on telegram to update the countdown.");
      }
    }
    Timer();

    //Halving progress data
    const totalBlocks = nextHalvingBlock - previousHalvingBlock;
    const completedBlocks = currentBlock - previousHalvingBlock;
    const progressPercent = (completedBlocks / totalBlocks) * 100;

    // Progress bar
    progress.style.width = progressPercent + '%';

    // Percentage
    document.querySelector('#progress-label').innerHTML = progressPercent.toFixed(2) + '%';
    
  } catch (error) {
    console.log("An error occurred:", error);
  }
}

fetchAllData();

