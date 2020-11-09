"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAdmin = void 0;
const firebase_admin_1 = require("firebase-admin");
const crypto_alerts_ce595_firebase_adminsdk_g8efc_3353416112_json_1 = __importDefault(require("./crypto-alerts-ce595-firebase-adminsdk-g8efc-3353416112.json"));
const serviceAccount = crypto_alerts_ce595_firebase_adminsdk_g8efc_3353416112_json_1.default;
exports.firebaseAdmin = firebase_admin_1.initializeApp({
    credential: firebase_admin_1.credential.cert(serviceAccount),
    databaseURL: 'https://crypto-alerts-ce595.firebaseio.com'
});
console.log('firebase admin initialised');
console.log(exports.firebaseAdmin);
//# sourceMappingURL=firebase.js.map