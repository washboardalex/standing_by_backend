import e, {Request, Response} from 'express';
import {logger} from '../app';

export const setFCMToken = async (req : Request, res : Response, db : any, bcrypt: any) => {

    if (req.body.token) {

        const { token, deviceId } = req.body;

        let tokenDb = await db
            .select('*')
            .from('fcmtoken')
            .where('device_id', deviceId)
            .catch((err:any) => logger.error(err));

        tokenDb = tokenDb[0];
        if (tokenDb) {
            //check that tokens line up otherwise update
            //they can be refreshed by the firebase server under certain circumstances
            if (token === tokenDb.token) {
                res.status(200).json({ fcm_token_id: tokenDb.fcm_token_id })
            } else {
                db("fcmtoken")
                    .update({token: token})
                    .where('device_id', deviceId)
                    .then((numUpdatedRows : number) => {
                        if(!numUpdatedRows) {
                            res.status(404).json('not found');
                            return;
                        }
                        res.status(200).json({fcm_token_id: tokenDb.fcm_token_id})
                    }).catch(function(err : any){
                        res.status(500).json('server error');
                        return;         
                    }); 
            }
        } else {
            db.insert({ token: token, device_id: deviceId })
                .into('fcmtoken')
                .returning('fcm_token_id')
                .then((newToken : any) => {
                    res.status(200).json({ fcm_token_id: newToken[0] });
                })
                .catch((err : any) => {
                    logger.error(err)
                    res.status(500).json('unable to add token');
                });
        }        
    }
}

