// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const envConfig = require("./lib/config");
const fs = require("fs");
const _data = require("./lib/data");
const handlers = require("./lib/handlers");
const staticObj = require("./lib/staticObj");


// Instatiate the HTTP server
const httpServer = http.createServer((req, res) => {

             unifiedServer(req, res);
    });

httpServer.listen(envConfig.httpPort, () => console.log(`Server listening on port: ${envConfig.httpPort} in ${envConfig.envName}`)); 


const httpsServerOptions = {
    "key": fs.readFileSync("./https/key.pem"),
    "cert": fs.readFileSync("./https/cert.pem")
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {

           unifiedServer(req, res); 
});

httpsServer.listen(envConfig.httpsPort, () => console.log(`Server listening on port: ${envConfig.httpsPort} in ${envConfig.envName}`)); 

// start the HTTP server


const unifiedServer = (req, res) => {

    const parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, ''); // replace all / at the begining or end



    let queryObj = parsedUrl.query;
    let reqMethod = req.method.toLowerCase();
    let headers = req.headers;
    console.log("This is is the query object", queryObj.phone);
    let decoder = new StringDecoder("utf-8");
    let buffer = '';
    req.on("data", data => {
        buffer += decoder.write(data);
    });

    req.on("end", () => {

        buffer += decoder.end();


        const validHandler = typeof(router[trimmedPath]) == 'undefined' ? handlers.notFound : router[trimmedPath];

             const data = {
             trimmedPath,
             queryObj,
             "method":reqMethod,
              headers,
             "payload":staticObj.parseJsonToObj(buffer)
              };

        validHandler(data, (statusCode, payload) => {

            statusCode = typeof(statusCode) == "number"? statusCode : 200;

            payload = typeof(payload) == "object" ? payload : {};

            let payloadString = JSON.stringify(payload);

            res.setHeader("Content-type", "application/json");
            res.writeHead(statusCode);

            res.end(payloadString);

         console.log(`Returning this response: ${statusCode}:${payloadString}`);

        });


    });
}


// Defining request  router

const router = {
    "ping" : handlers.ping,
    "users" : handlers.users,
};



