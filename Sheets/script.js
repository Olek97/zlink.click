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

// Footer copo address
function copyAddr() {
  const addr = document.querySelector("#copy-addr").innerText;
  navigator.clipboard.writeText(addr);
  alert("Thank you!");
}