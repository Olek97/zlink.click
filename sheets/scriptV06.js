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
const collapsibles = document.querySelectorAll('.collapsible');
const contents = document.querySelectorAll('.content');

collapsibles.forEach((collapsible, index) => {
  collapsible.addEventListener('click', () => {
    contents.forEach((content, contentIndex) => {
      if (contentIndex !== index) {
        content.style.display = 'none';
      }
    });
    
    if (contents[index].style.display !== 'block') {
      contents[index].style.display = 'block';
    } else {
      contents[index].style.display = 'none';
    }
  });
});