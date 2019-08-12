const {createServer: createHttpServer} = require("http");
const {createServer: createHttpsServer} = require("https");
const {parse} = require("url");
const {readFileSync} = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;
const {router, handlers} = require("./router");

function unifiedServer(req, res) {
    const parsedUrl = parse(req.url, true); // passing true to parse query string(req.query)
    const path = parsedUrl.pathname;
    const headers = req.headers;

    const queryStringObj = parsedUrl.query;
    const trimmedPath = path.replace(/^\/+\/+$/, "");
    const method = req.method.toLowerCase();
    const decoder = new StringDecoder('utf-8');

    let buffer = "";

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();
        const chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;
        // data to send to handler
        const data = {
            trimmedPath,
            queryStringObj,
            method,
            headers,
            payload: buffer
        };

        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof(statusCode) === "number" ? statusCode : 200;
            payload = typeof(payload) === "object" ? payload : {};
            // convert payload to string
            const payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
}

const httpServer = createHttpServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(3000, () => {
    console.log("Server is listening on 3000");
});

const httpsServerOptions = {
    key: readFileSync("./https/key.pem"),
    cert: readFileSync("./https/cert.pem")
};

const httpsServer = createHttpsServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

httpsServer.listen(3443, () => {
    console.log("Server is listening on 3000");
});