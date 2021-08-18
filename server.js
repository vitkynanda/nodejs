const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

//Instantiate http server
const httpServer = http.createServer((req, res) => {
  undefinedServer(req, res);
});

// Start the server
httpServer.listen(config.httpPort, () =>
  console.log(
    `Server is running on port ${config.httpPort} in ${config.name} mode`
  )
);

//Instantiate https server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  undefinedServer(req, res);
});

//Start the https server
httpsServer.listen(config.httpsPort, () =>
  console.log(
    `Server is running on port ${config.httpsPort} in ${config.name} mode`
  )
);

//All the server logic for both of http and  https server
const undefinedServer = function (req, res) {
  // Get url and parse it
  const parsedURL = url.parse(req.url, true);

  // Get the path url
  const path = parsedURL.pathname;

  //trimming path url path
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get Query string as an Object
  const queryStringObject = parsedURL.query;

  // Get the method
  const method = req.method.toLocaleLowerCase();

  // Get the heaedrr as an Object
  const headers = req.headers;

  // Get payload if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    //Choose the handler method this reques should go to, if one is not undefined go to specified route, if undefined go to notFound
    const chosenHandler =
      typeof route[trimmedPath] !== "undefined"
        ? route[trimmedPath]
        : handlers.notFound;

    //Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    // Route the request to the handler specified  in the router
    chosenHandler(data, function (statusCode, payload) {
      //Use status code called back by handler or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      //Use payload calleb back by handler, or default to empty object
      payload = typeof payload == "object" ? payload : {};

      //Convert payload as string
      const payloadString = JSON.stringify(payload);

      //Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      //Log ther response to the console
      console.log(`Returning this response :`, statusCode, payloadString);
    });
  });
};

//Define the handler
const handlers = {};

//Handler sample
handlers.sample = function (data, callback) {
  // Callback http status code and payload  object
  callback(406, { name: "Sample handlers" });
};

//Handler not found
handlers.notFound = function (data, callback) {
  //Callback http status code
  callback(404);
};

//Define route
const route = {
  sample: handlers.sample,
};
