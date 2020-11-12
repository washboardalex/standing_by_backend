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
exports.setFCMToken = void 0;
exports.setFCMToken = (req, res, db, bcrypt) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.token) {
        const token = req.body.token;
        let tokenInDb = yield db
            .select('*')
            .from('fcmtoken')
            .where('token', token);
        //add check for if theres more than one
        tokenInDb = tokenInDb[0];
        console.log("wtf is this");
        console.log(tokenInDb);
        if (tokenInDb) {
            res.status(200).json({ fcm_token_id: tokenInDb.fcm_token_id });
        }
        else {
            db.insert({ token })
                .into('fcmtoken')
                .returning('fcm_token_id')
                .then((newToken) => {
                console.log("added token!");
                console.log(newToken[0]);
                res.status(200).json({ fcm_token_id: newToken[0] });
            })
                .catch((err) => {
                console.error(err);
                res.status(400).json('unable to add token');
            });
        }
    }
});
//# sourceMappingURL=setFCMToken.js.map