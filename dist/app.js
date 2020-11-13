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
            // 
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