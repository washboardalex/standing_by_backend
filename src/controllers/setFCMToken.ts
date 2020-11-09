import {Request, Response} from 'express';

export const setFCMToken = (req : Request, res : Response, db : any, bcrypt: any) => {
    if (req.body.token) {

        const token = req.body.token;

        db.insert({ token })
        .into('fcmtoken')
        .then((newToken : any) => {
            console.log(newToken);
            res.status(200).send('successfully added token');
        })
        .catch((err : any) => {
            console.error(err)
            res.status(400).json('unable to add token');
        });
    }
}

