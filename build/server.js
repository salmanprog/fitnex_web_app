"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const source_map_support_1 = __importDefault(require("source-map-support"));
const https_1 = require("https");
const Ignitor_1 = require("@adonisjs/core/build/src/Ignitor");
const path_1 = require("path");
const fs_1 = require("fs");
require('dotenv').config();
if (process.env.PRODUCTION_TYPE == 'production') {
    const privateKey = (0, fs_1.readFileSync)((0, path_1.join)(__dirname + '/ssl/server.key'), 'utf8');
    const certificate = (0, fs_1.readFileSync)((0, path_1.join)(__dirname + '/ssl/server.crt'), 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    new Ignitor_1.Ignitor(__dirname)
        .httpServer()
        .start((handle) => {
        return (0, https_1.createServer)(credentials, handle);
    }).catch(console.error);
}
else {
    source_map_support_1.default.install({ handleUncaughtExceptions: false });
    console.log(process.env.PRODUCTION_TYPE);
    new Ignitor_1.Ignitor(__dirname)
        .httpServer()
        .start();
}
//# sourceMappingURL=server.js.map