"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// import cors from 'cors';
const morgan_1 = __importDefault(require("morgan"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./db/db");
const setFCMToken_1 = require("./controllers/setFCMToken");
const createAlert_1 = require("./controllers/createAlert");
const websocket_1 = require("./utils/websocket");
const app = express_1.default();
app.use(morgan_1.default('combined'));
app.use(body_parser_1.default.json());
app.post('/token', (req, res) => setFCMToken_1.setFCMToken(req, res, db_1.db, bcryptjs_1.default)); //add bcrypt later
app.post('/alert', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return createAlert_1.createAlert(req, res, db_1.db); }));
websocket_1.configureCoinApiWebSocket();
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server is listening on ${port}`));
//websocket - probably need to deal with this.
// const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,monero,litecoin');
// console.log('we are here');
// console.log(pricesWs);
// pricesWs.on('open', function open() {
//     console.log('Websocket connection successfully opened.');
// });
// pricesWs.on('message', function incoming(data) {
//     console.log('Incoming data from websocket connection: ');
//     console.log(data);
// });
//# sourceMappingURL=app.js.map