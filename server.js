const http = require("http");
const url = require("url");
const port = 3000;

const server = http.createServer((req, res) => {
  // Get url and parse it
  const parsedURL = url.parse(req.url, true);
  //console.log(parsedURL);

  // Get the path
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  // console.log(trimmedPath);

  // Send the response
  res.end("Hello world");
});

server.listen(port, () => console.log("server is listening on port " + port));
