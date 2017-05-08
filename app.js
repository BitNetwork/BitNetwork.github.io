const electron = require("electron");
const app = electron.app;

const path = require("path");
const url = require("url");

// app.on("ready", function() {
setTimeout(function() {
  var mainWindow = new electron.BrowserWindow({
    height: 600,
    width: 800,
    frame: false
  });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }));
// });
}, 1000);