"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAdmin = void 0;
const firebase_admin_1 = require("firebase-admin");
const covid19alerts_firebase_adminsdk_qsk8z_f6e73d8a61_json_1 = __importDefault(require("./covid19alerts-firebase-adminsdk-qsk8z-f6e73d8a61.json"));
const serviceAccount = covid19alerts_firebase_adminsdk_qsk8z_f6e73d8a61_json_1.default;
exports.firebaseAdmin = firebase_admin_1.initializeApp({
    credential: firebase_admin_1.credential.cert(serviceAccount),
    databaseURL: 'https://covid19app-e680a.firebaseio.com'
});
console.log('firebase admin initialised');
console.log(exports.firebaseAdmin);
//# sourceMappingURL=firebase.js.map