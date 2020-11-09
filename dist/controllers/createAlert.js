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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlert = void 0;
const websocket_1 = require("../utils/websocket");
exports.createAlert = (req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    //make sure to include implementation for many-to-many - if there are identical alerts you should just add the
    //reference to the fcmtoken its using. not necessary right now for testing but you should implement this
    if (req.body.newAlert && req.body.token) {
        let { newAlert } = req.body;
        const { token } = req.body;
        console.log('');
        console.log('');
        console.log('');
        console.log('NEW ALERT INCOMING');
        console.log(newAlert);
        console.log('');
        console.log('');
        console.log('');
        const coinSymbol = newAlert.coin;
        let coinSymbolId = yield db.select('*').from('coin')
            .where('symbol', coinSymbol);
        coinSymbolId = coinSymbolId[0].coinid;
        newAlert.coinid = coinSymbolId;
        let coinActiveAlertEntry = yield db.select('*').from('coinwithactivealert').where('coinid', coinSymbolId);
        //stops having to check every coin when websocket data comes in
        if (coinActiveAlertEntry.length === 0) {
            console.log('');
            console.log('');
            console.log('');
            console.log('COIN ACTIVE ALERT ENTRY');
            console.log('THIS SHOULD BE NULL OR AN EMPTY ARRAY OR SOMESUCH');
            console.log(coinActiveAlertEntry);
            yield db.insert({
                coinid: coinSymbolId
            })
                .into('coinwithactivealert')
                .returning('coinid')
                .then((insertedid) => {
                insertedid = insertedid[0];
                console.log('this is what is returned once you do this.');
                console.log(insertedid);
                console.log('And then reset websocket.');
                db.select('*')
                    .from('coin')
                    .where('coinid', insertedid)
                    .then((coin) => {
                    coin = coin[0].name;
                    websocket_1.updateWebSocket(coin);
                })
                    .catch((err) => console.log(err));
            })
                .catch((err) => console.error(err));
        }
        const { coin } = newAlert, newAlertFormatted = __rest(newAlert, ["coin"]);
        console.log('');
        console.log('');
        console.log('');
        console.log('ok lets see if this works');
        console.log('NEW ALERT MODIFIED');
        console.log(newAlertFormatted);
        console.log('');
        console.log('');
        console.log('');
        let fcmTokenId = yield db.select('*').from('fcmtoken')
            .where('token', token);
        fcmTokenId = fcmTokenId[0].fcmtokenid;
        db.insert(Object.assign({}, newAlertFormatted))
            .into('alert')
            .returning('alertid')
            .then((alertId) => {
            const alertIdInt = alertId[0];
            db.insert({
                fcmtokenid: fcmTokenId,
                alertid: alertIdInt
            })
                .into('fcmtokenalertrelation')
                .returning('alertid')
                .then((alertId) => res.sendStatus(200))
                .catch((err) => console.error(err));
        })
            .catch((err) => console.error(err));
    }
});
//# sourceMappingURL=createAlert.js.map