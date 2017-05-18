var lib_http = require("http");
var lib_fs = require("fs");
var lib_path = require("path");

var http = lib_http.createServer(function(request, response) {
  var filePath = "." + request.url;
  if (filePath === "./") {
    filePath = "./index.html";
  }

  var extname = lib_path.extname(filePath);
  var contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".wav":
      contentType = "audio/wav";
      break;
  }
  
  filePath = (process.argv[2] || __dirname) + filePath;

  lib_fs.readFile(filePath, function(error, content) {
    if (error) {
      if (error.code === "ENOENT"){
        lib_fs.readFile("./404.html", function(error, content) {
          response.writeHead(404, { "Content-Type": contentType });
          response.end(content, "utf-8");
        });
      } else {
        response.writeHead(500);
        response.end("Sorry, check with the site admin for error: "+error.code+" ..\n");
        response.end();
      }
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
}).listen(8080);