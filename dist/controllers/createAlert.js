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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlert = void 0;
// const createUserAlertRelation = async (countryId : number, db: any) => {
//     await db.insert({
//         countryId: countryId
//     })
//     .into('countrywithactivealert')
//     .catch((err: any) => console.error(err));
// }
exports.createAlert = (req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hitting the function as expected");
    //make sure to include implementation for many-to-many - if there are identical alerts you should just add the
    //reference to the fcmtoken its using. not necessary right now for testing but you should implement this
    if (req.body.newAlert && req.body.token) {
        console.log("body parser is working");
        let { newAlert } = req.body;
        const { token, tokenId } = req.body;
        const countryCode = newAlert.country;
        console.log(newAlert, token, countryCode);
        console.log('entering first db call');
        //get the id from admin db - country code sent from third party api so no id on client
        let countryCodeTuple = yield db
            .select('*')
            .from('country')
            .where('country_code', countryCode);
        let countryId = countryCodeTuple[0].country_id;
        newAlert.id = countryId;
        console.log('entering second db call');
        //checks if that exact already exists
        //if it does, simply add a reference to the 
        let checkExistingAlerts = yield db
            .select('alert_id')
            .from('alert')
            .where({
            'country_id': countryId,
            'condition': newAlert.condition,
            'value': newAlert.value,
            'type': newAlert.type
        });
        console.log('checking existing alerts');
        console.log(checkExistingAlerts);
        if (checkExistingAlerts.length === 0) {
            console.log('no existing alert, add a new one');
            let alertId = yield db.insert({
                'country_id': countryId,
                'condition': newAlert.condition,
                'value': newAlert.value,
                'type': newAlert.type
            })
                .into('alert')
                .returning('alert_id')
                .catch((err) => console.error(err));
            alertId = alertId[0];
            //validate the token
            let dbToken = yield db.select('token')
                .from('fcmtoken')
                .where('fcm_token_id', tokenId)
                .catch((err) => {
                console.error(err);
            });
            dbToken = dbToken[0].token;
            //if token is valid update the m2m relation
            if (dbToken === token) {
                const insertion = yield db
                    .insert({
                    fcm_token_id: tokenId,
                    alert_id: alertId
                })
                    .into('fcmtokenalertrelation')
                    .returning('*')
                    .catch((err) => {
                    console.error(err);
                });
                console.log('insertion has occurred');
                console.log(insertion);
            }
            else {
                //send an error
            }
        }
        else {
            //alert already exists, just update the relation
            console.log('should only see this if you already added the alert');
        }
    }
});
//# sourceMappingURL=createAlert.js.map