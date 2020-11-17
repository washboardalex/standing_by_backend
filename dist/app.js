"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const axios_1 = __importDefault(require("axios"));
const morgan_1 = __importDefault(require("morgan"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./db/db");
const cron = __importStar(require("node-cron"));
const setFCMToken_1 = require("./controllers/setFCMToken");
const createAlert_1 = require("./controllers/createAlert");
const constants_1 = require("./utils/constants");
const functions_1 = require("./utils/functions");
const firebase_1 = require("./utils/firebase/firebase");
const app = express_1.default();
app.use(morgan_1.default('combined'));
app.use(body_parser_1.default.json());
//run through alerts and send alerts as required
cron.schedule('* * * * *', function () {
    const axiosConfig = { headers: constants_1.headers };
    //get updated country data
    axios_1.default.get(`${constants_1.covidApiUrl}/summary`, axiosConfig)
        .then((response) => __awaiter(this, void 0, void 0, function* () {
        if (response.status === 200 && response.data) {
            console.log('The data from the api call: ');
            console.log(response.data);
            const allCountrySummary = functions_1.formatCountries(response.data.Countries);
            // get all the alerts
            const alerts = yield db_1.db('alert')
                .join('country', 'country.country_id', 'alert.country_id')
                .join('fcmtokenalertrelation', 'fcmtokenalertrelation.alert_id', 'alert.alert_id')
                .join('fcmtoken', 'fcmtoken.fcm_token_id', 'fcmtokenalertrelation.fcm_token_id')
                .select('*');
            console.log('alerts are : ');
            console.log(alerts);
            // compare the conditions, if conditions met, send a firebase cloud message
            for (let i = 0; i < alerts.length; i++) {
                const alert = alerts[i];
                let comparisonOperator;
                switch (alert.condition) {
                    case 'greaterThan':
                        comparisonOperator = functions_1.greaterThan;
                        break;
                    case 'lessThan':
                        comparisonOperator = functions_1.lessThan;
                        break;
                    default:
                        comparisonOperator = functions_1.greaterThan;
                }
                const type = alert.type; //this is veeeeery bad - youll need to fix, add a model or something
                for (let n = 0; n < allCountrySummary.length; n++) {
                    console.log('looping');
                    const country = allCountrySummary[n];
                    if (alert.country_name === country.country) {
                        console.log('alert condition: ', alert.condition);
                        console.log('type: ', alert.type);
                        console.log(type);
                        console.log('condition check');
                        const isConditionMet = comparisonOperator(functions_1.getKeyValue(type)(country), alert.value);
                        console.log('alert value:', alert.value);
                        console.log('country value: ', functions_1.getKeyValue(type)(country));
                        console.log('is condition met: ', isConditionMet);
                        if (isConditionMet) {
                            //send firebase cloud message
                            console.log('condition met!!!');
                            console.log('device id: ');
                            console.log(alert.token);
                            console.log('fuckit heres the whole alert');
                            console.log(alert);
                            console.log('Sending Alert');
                            const message = {
                                data: {
                                    country: country.country,
                                    threshold: alert.value.toString(),
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
            }
        }
    }))
        .catch((error) => {
        console.error(error);
    });
});
app.post('/token', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return setFCMToken_1.setFCMToken(req, res, db_1.db, bcryptjs_1.default); })); //add bcrypt later
app.post('/alert', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return createAlert_1.createAlert(req, res, db_1.db); }));
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server is listening on ${port}`));
//# sourceMappingURL=app.js.map