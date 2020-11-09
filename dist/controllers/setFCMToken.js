"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFCMToken = void 0;
exports.setFCMToken = (req, res, db, bcrypt) => {
    if (req.body.token) {
        const token = req.body.token;
        db.insert({ token })
            .into('fcmtoken')
            .then((newToken) => {
            console.log(newToken);
            res.status(200).send('successfully added token');
        })
            .catch((err) => {
            console.error(err);
            res.status(400).json('unable to add token');
        });
    }
};
//# sourceMappingURL=setFCMToken.js.map