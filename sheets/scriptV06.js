// Stop using Firefox :)
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

// Collapse
const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}