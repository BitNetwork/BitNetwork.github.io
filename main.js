// BitNetwork's Github (browser) and electron apps
// Same script used for both the browser and electron with an execption of the top line.
// Therefore apps should be cross-compatible with the browser and electron, with custom cross-compatible methods
// TO-DO: Http requests, database perodic saves

// Specify runtime environment. Do this automatically pls...
// const environment = "browser";
const environment = "electron";

var core = {
  data: {}
};

// Use localstorage with JSON encoded data for the browser
// Use a json file ith JSON encoded data for electron

if (environment === "browser") {

  if (localStorage.getItem("data") !== null) {
    try {
      core.data = JSON.parse(localStorage.getItem("data"));
    } catch (error) {}
  }

  core.saveData = function() {
    let newData = core.data;
    let oldData = null;

    if (localStorage.getItem("data") !== null) {
      try {
        oldData = JSON.parse(localStorage.getItem("data"));
      } catch (error) {}
    }
    if (oldData === null || newData !== oldData) {
      localStorage.setItem("data", JSON.stringify(newData));
    }
  }

} else if (environment === "electron") {

  const electron = require("electron");
  const remote = electron.remote;
  const window = remote.getCurrentWindow();
  const app = remote.app;

  const fs = require("fs");
  const path = require("path");

  let dataPath = path.join(__dirname, "data.json");

  if (fs.existsSync(dataPath)) {
    try {
      core.data = JSON.parse(fs.readFileSync(dataPath, {encoding: "utf-8"}));
    } catch (error) {}
  }

  core.saveData = function() {
    let newData = core.data;
    let oldData = null;

    if (fs.existsSync(dataPath)) {
      try {
        oldData = JSON.parse(fs.readFileSync(dataPath, {encoding: "utf-8"}));
      } catch (error) {}
    }
    if (oldData === null || newData !== oldData) {
      fs.writeFileSync(dataPath, JSON.stringify(newData), "utf-8");
    }
  }

  document.getElementById("minimize-window").firstElementChild.addEventListener("click", function(event) {
    window.minimize();
  });

  function windowRestoreHandler() {
    window.unmaximize();
    if (window.isMaximized() === false) {
      document.getElementById("maximize-window").style.display = "inline-flex";
      document.getElementById("restore-window").style.display = "none";
    }
  };

  document.getElementById("restore-window").firstElementChild.addEventListener("click", windowRestoreHandler);
  window.addListener("unmaximize", windowRestoreHandler);

  function windowMaximizeHandler() {
    window.maximize();
    if (window.isMaximized()) {
      document.getElementById("maximize-window").style.display = "none";
      document.getElementById("restore-window").style.display = "inline-flex";
    }
  };

  document.getElementById("maximize-window").firstElementChild.addEventListener("click", windowMaximizeHandler);
  window.addListener("maximize", windowMaximizeHandler);
  if (window.isMaximized()) {
    windowMaximizeHandler();
  }

  document.getElementById("close-window").firstElementChild.addEventListener("click", function(event) {
    window.close();
  });

  document.addEventListener("keydown", function(event) {
    console.dir(event);
    if ((event.code === "KeyR" && event.ctrlKey) || event.code === "F5") {
      event.preventDefault();
    } else if (event.code === "F11") {
      event.preventDefault();
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

}

core.data = new Proxy(core.data, {
  set: function(target, name) {
    core.saveData();
  }
});

let theme = typeof core.data.theme === "undefined" ? "dark" : core.data.theme;
let accent = typeof core.data.accent === "undefined" ? "lime" : core.data.accent;
let density = typeof core.data.density === "undefined" ? "cozy" : core.data.density;

document.body.classList.add(theme + "-theme");
document.body.classList.add(accent + "-accent");
document.body.classList.add(density + "-density");

let hamburger = document.getElementById("hamburger");
let menu = document.getElementById("menu");
let menuActive = null;
hamburger.onclick = function(event) {
  switch (menuActive) {
    case null:
      hamburger.className = "active";
      menu.className = "active";
      menuActive = true;
      break;
    case true:
      hamburger.className = "inactive";
      menu.className = "inactive";
      menuActive = false;
      break;
    case false:
      hamburger.className = "active";
      menu.className = "active";
      menuActive = true;
      break;
  }
};

// We need a per-element listener. We can't use oncontextmenu. Null it out to prevent the oringal context menu from showing tho.
window.oncontextmenu = function(event) {
  event.preventDefault();
};


let context = document.getElementById("context-menu");
let links = document.getElementsByClassName("context-link");
for (let i = 0; i < links.length; i++) {
  let link = links[i];

  link.addEventListener("mousedown", function(event) {
    if (event.button === 2) { // Right click
      event.preventDefault();
      context.style.left = event.clientX + "px";
      context.style.top = event.clientY + "px";
      document.getElementById("open-in-new-tab").href = link.href;
      context.style.display = "block";
    }
  });
}

document.body.addEventListener("mousemove", function(event) {
  if (context.style.display === "block") {
    var target = event.target;
    while (target.tagName !== "BODY") {
      if (target.id === "context-menu") {
        return;
      } else {
        target = target.parentElement;
      }
    }
    context.style.display = "none";

  }
});

// temp stuff for testing themes
window.onhashchange = function(event) {
  let hash = location.hash;
  if (hash === "") {
    return;
  }

  document.body.className = decodeURIComponent(hash).substring(0, 1) === "#" ? decodeURIComponent(hash).substring(1) : decodeURIComponent(hash);
};

window.onhashchange();
