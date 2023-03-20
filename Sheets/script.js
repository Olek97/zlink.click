// Fuck firefox
const isFirefox = typeof InstallTrigger !== 'undefined';
if (isFirefox) {
  alert("Browser unsupported.");
}

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

