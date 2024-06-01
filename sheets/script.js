// Stop using Firefox :)
const isFirefox = typeof InstallTrigger !== 'undefined';
if (isFirefox) {
  alert("Browser unsupported.");
}

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

// Site's latest update date
const xhr = new XMLHttpRequest();
xhr.open("HEAD", window.location.href, true);
xhr.onreadystatechange = () => {
  if (xhr.readyState === xhr.DONE) {
    const lastModified = new Date(xhr.getResponseHeader('Last-Modified'));
    document.getElementById("last-update").innerHTML = `Latest update ${lastModified.toLocaleDateString()}`;
  }
}
xhr.send();

// Footer copy address
function copyAddr() {
  const addr = document.querySelector('#copy-addr').innerText;
  navigator.clipboard.writeText(addr);
  alert('Copied, thank you!');
}

alert("Incomplete network data due to the end of support for https://zcashblockexplorer.com/ and its API.")