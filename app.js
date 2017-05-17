const electron = require("electron");
const app = electron.app;
const globalShortcut = electron.globalShortcut;

const path = require("path");
const url = require("url");

app.on("ready", function() {

  var window = new electron.BrowserWindow({
    height: 600,
    width: 800,
    frame: false,
    show: false
  });

  window.once("ready-to-show", function() {
    window.show()
  });

  window.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }));

});
