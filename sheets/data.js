const config = {
  cacheKey: 'zcashDataCache',
  cacheTimeout: 2 * 60 * 1000,
  api: [
    "https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false&precision=5&c",
    "https://api.blockchair.com/zcash/stats",
    "https://data.messari.io/api/v1/assets/zcash/metrics",
    "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://mainnet.zcashexplorer.app/api/v1/blockchain-info"),
    "https://api.3xpl.com/?token=3A0_t3st3xplor3rpub11cb3t4efcd21748a5e",
    //"https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sprout_supply.json",
    //"https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/sapling_supply.json",
    //"https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/orchard_supply.json",
  ],
  previousHalvingBlock: 1046400,
  nextHalvingBlock: 2726400,
  maxSupply: 21000000,
  blockReward: 3.125,
  blocksPerDay: 1152,
};

async function updateData() {
  const cache = JSON.parse(localStorage.getItem(config.cacheKey) || '{}');
  const now = Date.now();
  
  if (now - cache.timestamp < config.cacheTimeout) {
    return cache.data;
  }
  
  const data = await Promise.all(config.api.map(url => fetch(url).then(r => r.json())));
  localStorage.setItem(config.cacheKey, JSON.stringify({ timestamp: now, data }));
  return data;
}

(async function() {
  try {
    const [cgk, bhr, msr, zex, xpl] = await updateData();

    const currentBlock = bhr.data.blocks;
    const difficulty = bhr.data.difficulty;
    const mempool = bhr.data.mempool_transactions;
    const blocksToHalving = config.nextHalvingBlock - currentBlock;
    const secsToHalving = blocksToHalving * 75;
    const countDownDate = Date.now() + secsToHalving * 1000;
    const sprout = zex.valuePools[1].chainValue;
    const sapling = zex.valuePools[2].chainValue;
    const orchard = zex.valuePools[3].chainValue;
    const shielded = sprout + sapling + orchard;
    const totalSupply = msr.data.supply.circulating;
    const transparent = zex.valuePools[0].chainValue;
    const percentShielded = transparent !== 0 ? (shielded / transparent) * 100 : 0;
    const price = msr.data.market_data.price_usd;
    const priceChange24 = msr.data.market_data.percent_change_usd_last_24_hours;
    const marketCap = price * totalSupply;
    const diluitedMarketCap = price * config.maxSupply;
    const dailyZec = config.blocksPerDay * config.blockReward;
    const yearlyZec = config.blocksPerDay * 365 * config.blockReward;
    const inflationRate = (yearlyZec / totalSupply) * 100;

    // Update UI
    document.getElementById('txt-price').innerHTML = price.toFixed(2) + " $";
    document.getElementById('txt-market-cap').innerHTML = Math.floor(marketCap).toLocaleString("en-US") + " $";
    document.getElementById('txt-diluited-market-cap').innerHTML = Math.floor(diluitedMarketCap).toLocaleString("en-US") + " $";
    document.getElementById('txt-price-change24').innerHTML = priceChange24.toFixed(2) + "%";
    document.getElementById('txt-current-block').innerHTML = currentBlock.toLocaleString("en-US");
    document.getElementById('txt-to-halving').innerHTML = blocksToHalving.toLocaleString("en-US");
    document.getElementById('txt-block-reward').innerHTML = config.blockReward.toLocaleString("en-US") + " ZEC";
    document.getElementById('txt-daily-zec').innerHTML = dailyZec.toLocaleString("en-US") + " ZEC";
    document.getElementById('txt-inflation').innerHTML = inflationRate.toFixed(2) + "%";
    document.getElementById('txt-difficulty').innerHTML = difficulty.toLocaleString("en-US");
    document.getElementById('txt-halving-date').innerHTML = new Date(countDownDate).toDateString();
    document.getElementById('txt-mempool').innerHTML = mempool.toLocaleString("en-US") + " TXs";
    document.getElementById('txt-tpool').innerHTML = Math.floor(transparent).toLocaleString("en-US") + " ZEC";
    document.getElementById('txt-zcpool').innerHTML = Math.floor(sprout).toLocaleString("en-US") + " ZEC";
    document.getElementById('txt-zspool').innerHTML = Math.floor(sapling).toLocaleString("en-US") + " ZEC";
    document.getElementById('txt-opool').innerHTML = Math.floor(orchard).toLocaleString("en-US") + " ZEC";
    document.getElementById('txt-shieldedpool').innerHTML = Math.floor(shielded).toLocaleString("en-US") + " ZEC";
    document.getElementById('txt-shieldedpercent').innerHTML = percentShielded.toFixed(2) + "%";
    document.getElementById('txt-total-supply').innerHTML = Math.floor(totalSupply).toLocaleString("en-US") + " ZEC";

    // Timer
    setInterval(() => {
      const now = Date.now();
      const distance = countDownDate - now;
      if (distance < 0) {
        clearInterval(interval);
        alert("Happy halving! To the mooooooooooooooooooooooooooooooooooooooon.");
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, "0");
      document.getElementById('txt-timer').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s to go`;
    }, 1000);

    // Progress bar
    const totalBlocks = config.nextHalvingBlock - config.previousHalvingBlock;
    const progressPercent = 100 - (blocksToHalving / totalBlocks) * 100;
    document.querySelector('#progress').style.width = progressPercent + '%';
    document.querySelector('#progress-label').innerHTML = progressPercent.toFixed(2) + '%';
  } catch (error) {
    console.error("Error in fetching data:", error);
    alert("Error in fetching data. Try again later");
  }
})();
