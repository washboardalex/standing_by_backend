"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAdmin = void 0;
const firebase_admin_1 = require("firebase-admin");
const covid19app_e680a_firebase_adminsdk_k6u14_dfa3a5a3e6_json_1 = __importDefault(require("./covid19app-e680a-firebase-adminsdk-k6u14-dfa3a5a3e6.json"));
const serviceAccount = covid19app_e680a_firebase_adminsdk_k6u14_dfa3a5a3e6_json_1.default;
exports.firebaseAdmin = firebase_admin_1.initializeApp({
    credential: firebase_admin_1.credential.cert(serviceAccount),
    databaseURL: 'https://covid19app-e680a.firebaseio.com'
});
console.log('firebase admin initialised');
console.log(exports.firebaseAdmin);
//# sourceMappingURL=firebase.js.map