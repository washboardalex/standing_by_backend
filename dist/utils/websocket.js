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
exports.updateWebSocket = exports.configureCoinApiWebSocket = void 0;
const constants_1 = require("./constants");
const ws_1 = __importDefault(require("ws"));
const db_1 = require("../db/db");
const firebase_1 = require("./firebase/firebase");
let priceWebSocket;
const addWebSocketListeners = (priceWebSocket) => {
    const currencies = priceWebSocket.url.split('?')[1].split(',');
    currencies[0] = currencies[0].replace('assets=', '');
    console.log(currencies);
    priceWebSocket.on('open', function open() {
        console.log('Websocket connection successfully opened.');
    });
    priceWebSocket.on('message', function incoming(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('typeof data is : ');
            console.log(typeof data);
            console.log('the data itself is: ');
            console.log(data);
            console.log('json parse of data is:');
            console.log(JSON.parse(data));
            data = JSON.parse(data);
            //str to number for price vals
            let updatedCurrencies = [];
            for (let i = 0, len = currencies.length; i < len; ++i) {
                const key = currencies[i];
                if (data[key]) {
                    data[key] = Number(data[key]);
                    updatedCurrencies.push(key);
                }
            }
            console.log('Incoming data from websocket connection: ');
            console.log(data);
            console.log('getting data from database');
            const alerts = yield db_1.db('alert')
                .join('coin', 'coin.coinid', 'alert.coinid')
                .join('fcmtokenalertrelation', 'fcmtokenalertrelation.alertid', 'alert.alertid')
                .join('fcmtoken', 'fcmtoken.fcmtokenid', 'fcmtokenalertrelation.fcmtokenid')
                .select('*')
                .whereIn('name', updatedCurrencies);
            console.log('Database join command: ');
            console.log(alerts);
            console.log('please also take note of new message events');
            for (let i = 0, len = alerts.length; i < len; ++i) {
                const alert = alerts[i];
                console.log(alert);
                let conditionMet = false;
                if (alert.type === 'price') {
                    const thresholdValue = Number(alert.value);
                    switch (alert.condition) {
                        case 'greaterThan':
                            if (data[alert.name] > thresholdValue)
                                conditionMet = true;
                            console.log('greaterThan selected');
                            break;
                        case 'lessThan':
                            if (data[alert.name] < thresholdValue)
                                conditionMet = true;
                            console.log('lessThan selected');
                            break;
                        default:
                            console.error('No types match in alert object');
                    }
                    console.log('JUST CHECKING THE TOKEN');
                    console.log(alert.token);
                    if (conditionMet) {
                        console.log('Sending Alert');
                        const message = {
                            data: {
                                price: 'itsjustatestalert',
                                threshold: thresholdValue.toString(),
                                condition: 'its a test dont worry about value for now'
                            },
                            notification: {
                                title: 'Basic Notification',
                                body: 'This is a basic notification sent from the server!',
                                imageUrl: 'https://my-cdn.com/app-logo.png',
                            },
                            token: alert.token
                        };
                        firebase_1.firebaseAdmin.messaging().send(message)
                            .then((response) => {
                            // Response is a message ID string.
                            console.log('Successfully sent message:', response);
                        })
                            .catch((error) => {
                            console.log('Error sending message:', error);
                        });
                    }
                }
            }
        });
    });
};
exports.configureCoinApiWebSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    //configure the way you get the stream.
    const coinsWithAlert = yield db_1.db('coinwithactivealert')
        .join('coin', 'coin.coinid', 'coinwithactivealert.coinid')
        .select('coin.name');
    // .catch((err : any) => console.error(err))
    console.log('coinsWithAlert is : ');
    console.log(coinsWithAlert);
    if (!!coinsWithAlert.length) {
        const arrayReducer = (accumulator, currentValue) => accumulator + currentValue.name + ',';
        let coinsWithAlertString = coinsWithAlert.reduce(arrayReducer, '');
        coinsWithAlertString = coinsWithAlertString.substring(0, coinsWithAlertString.length - 1);
        console.log('coinsWithAlertString is : ');
        console.log(coinsWithAlertString);
        const webSocketQry = `/prices?assets=${coinsWithAlertString}`;
        console.log(constants_1.coinApiWebsocket + webSocketQry);
        priceWebSocket = new ws_1.default(constants_1.coinApiWebsocket + webSocketQry);
        console.log('Web Socket Successfully created - Check: ');
        console.log(priceWebSocket);
        addWebSocketListeners(priceWebSocket);
    }
});
exports.updateWebSocket = (coinName) => {
    console.log('updating websocket');
    let urlStr = priceWebSocket.url;
    console.log(urlStr);
    console.log('now close the websocket');
    priceWebSocket.close();
    priceWebSocket = new ws_1.default(urlStr + `,${coinName}`);
    addWebSocketListeners(priceWebSocket);
};
//# sourceMappingURL=websocket.js.map