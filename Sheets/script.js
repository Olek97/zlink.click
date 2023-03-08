window.addEventListener("load", function() {
    document.querySelectorAll('link[rel="stylesheet"], img, script').forEach(function(el) {
      el.setAttribute("cache-control", "no-cache, no-store, must-revalidate");
      el.setAttribute("pragma", "no-cache");
      el.setAttribute("expires", "0");
    });
  });

const MaxSupply = 21000000;
const BlocksPerDay = 1152;