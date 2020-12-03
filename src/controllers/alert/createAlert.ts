import {Request, Response} from 'express';
import { UNIQUE_VIOLATION } from '../../utils/errors';
import { formatNewAlertView } from './utils';


export const createAlert = async (req: Request, res : Response, db:any) => {

    //validate json
    if (!req.body.newAlert || !req.body.token) {
        res.status(400).json('invalid json');
        return;
    }

    let { newAlert } = req.body;
    const { token, tokenId } = req.body;
    const countryCode = newAlert.country;

    //validate the token
    let dbToken = await db.select('token')
    .from('fcmtoken')
    .where('fcm_token_id', tokenId)
    .catch((err : any) => {
        console.error(err);
        res.status(400).json('database error');
        return;
    });

    dbToken = dbToken[0].token;
    
    if (dbToken !== token) {
        res.status(401).json('invalid token');
        return;
    }
    
    //get the id from admin db - country code sent from third party api so no id on client
    let countryCodeTuple = await db
            .select('*')
            .from('country')
            .where('country_code', countryCode)
            .catch((err : any) => {
                console.error(err);
                res.status(400).json('database error');
                return;
            });

    const { country_id, country_name, country_slug } = countryCodeTuple[0];

    //checks if that exact already exists
    //if it does, simply add a reference to the 
    let checkExistingAlerts = await db
            .select('alert_id')
            .from('alert')
            .where({
                'country_id': country_id,
                'condition': newAlert.condition,
                'value': newAlert.value,
                'type': newAlert.type
            })
            .catch((err : any) => {
                console.error(err);
                res.status(400).json('database error');
                return;
            });;
    
    if (checkExistingAlerts.length === 0) {
        
        //insert new alert details
        const insertion = db.transaction((trx : any) => {
            trx.insert({
                'country_id': country_id,
                'condition': newAlert.condition,
                'value': newAlert.value,
                'type': newAlert.type
            })
            .into('alert')
            .returning('*')
            .then((newAlert : any) => {
                newAlert = newAlert[0];
                return trx
                    .insert({
                        fcm_token_id: tokenId,
                        alert_id: newAlert.alert_id
                    })
                    .into('fcmtokenalertrelation')
                    .returning('*')
                    .then((tuple : any) => {
                        res.status(200).json(formatNewAlertView(newAlert, country_name, country_slug));
                    })
                    .catch((err : any) => {
                        console.error(err);
                    });
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch((err : any) => res.status(500).json('unable to create alert'));
 
    } else {
        // alert already exists, just update the relation
        const existingAlert = checkExistingAlerts[0]
        db.insert({
            fcm_token_id: tokenId,
            alert_id: existingAlert.alert_id
        })
        .into('fcmtokenalertrelation')
        .returning('*')
        .then((tuple : any) => {
            res.status(200).json(existingAlert);
        })
        .catch((err : any) => {
            console.error(err)

            if (Number(err.code) === UNIQUE_VIOLATION) {
                res.status(409).json('duplicate alert');
            }

            res.status(400).json('unable to create alert');
        });
    }
}