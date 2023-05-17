/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
// https-json-server.js
// Run with: node https-json-server.js

// Generate SSL keys: openssl req -nodes -new -x509 -keyout server.key -out server.cert

import pause from "connect-pause";
import fs from "fs";
// import https from "https";
import http from "http";
import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";
import 'dotenv/config'

const port = process.env.PORT || 3200;
console.log('port', port);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === "POST") {
        req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});

server.use(pause(500));
server.use(router);


// If using custom routes
// var routes = JSON.parse(fs.readFileSync('routes.json'));
// server.use(jsonServer.rewriter(routes));

http.createServer(server).listen(port, ()=> {
    console.log("db-server started at http://localhost:" + port +"/");
});

// // https
// const keyFile = path.join(__dirname, "cert", "localhost-key.pem");
// const certFile = path.join(__dirname, "cert", "localhost.pem");

// https
//     .createServer(
//         {
//             key: fs.readFileSync(keyFile),
//             cert: fs.readFileSync(certFile),
//         },
//         server
//     )
//     .listen(3001, () => {
//         console.log("json-server started at https://localhost:3001/");
//     });
