import {Request, Response} from 'express';

export const setFCMToken = async (req : Request, res : Response, db : any, bcrypt: any) => {

    if (req.body.token) {

        const token = req.body.token;

        let tokenInDb = await db
            .select('*')
            .from('fcmtoken')
            .where('token', token);

        //add check for if theres more than one

        tokenInDb = tokenInDb[0]

        console.log("wtf is this")
        console.log(tokenInDb)  

        if (tokenInDb) {
            res.status(200).json({ fcm_token_id: tokenInDb.fcm_token_id })
        } else {
            db.insert({ token })
                .into('fcmtoken')
                .returning('fcm_token_id')
                .then((newToken : any) => {
                    console.log("added token!")
                    console.log(newToken[0]);
                    res.status(200).json({ fcm_token_id: newToken[0] });
                })
                .catch((err : any) => {
                    console.error(err)
                    res.status(400).json('unable to add token');
                });
        }

        
    }
}

