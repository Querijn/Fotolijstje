"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_app_1 = require("./server-app");
const server = new server_app_1.default();
server.get('/', function (req, res) {
    res.send(':)');
});
server.run();
//# sourceMappingURL=index.js.map