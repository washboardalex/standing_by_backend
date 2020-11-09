import {Request, Response} from 'express';
import {updateWebSocket} from '../utils/websocket';

export const createAlert = async (req: Request, res : Response, db:any) => {
    //make sure to include implementation for many-to-many - if there are identical alerts you should just add the
    //reference to the fcmtoken its using. not necessary right now for testing but you should implement this
    if (req.body.newAlert && req.body.token) { 

        let { newAlert } = req.body;
        const { token } = req.body;

        console.log('');
        console.log('');
        console.log('');
        console.log('NEW ALERT INCOMING');
        console.log(newAlert);
        console.log('');
        console.log('');
        console.log('');

        const coinSymbol = newAlert.coin;

        let coinSymbolId = await db.select('*').from('coin')
            .where('symbol', coinSymbol);
        coinSymbolId = coinSymbolId[0].coinid;
        newAlert.coinid = coinSymbolId;

        let coinActiveAlertEntry = await db.select('*').from('coinwithactivealert').where('coinid', coinSymbolId);
        
        
        
        //stops having to check every coin when websocket data comes in
        if (coinActiveAlertEntry.length === 0) {

            console.log('');
            console.log('');
            console.log('');
            console.log('COIN ACTIVE ALERT ENTRY');
            console.log('THIS SHOULD BE NULL OR AN EMPTY ARRAY OR SOMESUCH');
            console.log(coinActiveAlertEntry);
            
            await db.insert({
                coinid: coinSymbolId
            })
            .into('coinwithactivealert')
            .returning('coinid')
            .then((insertedid : any) => {
                insertedid = insertedid[0];
                console.log('this is what is returned once you do this.');
                console.log(insertedid);
                console.log('And then reset websocket.');
                db.select('*')
                    .from('coin')
                    .where('coinid', insertedid)
                    .then((coin : any) => {
                        coin = coin[0].name;
                        updateWebSocket(coin);

                    })
                    .catch((err : any) => console.log(err))
            })
            .catch((err: any) => console.error(err));
        }
        
        const { coin, ...newAlertFormatted } = newAlert;

        console.log('');
        console.log('');
        console.log('');
        console.log('ok lets see if this works');
        console.log('NEW ALERT MODIFIED');
        console.log(newAlertFormatted);
        console.log('');
        console.log('');
        console.log('');

        let fcmTokenId = await db.select('*').from('fcmtoken')
            .where('token', token)
        
        fcmTokenId = fcmTokenId[0].fcmtokenid;

        db.insert({
            ...newAlertFormatted
        })
        .into('alert')
        .returning('alertid')
        .then((alertId : any) => {
            const alertIdInt = alertId[0];

            db.insert({
                fcmtokenid: fcmTokenId,
                alertid: alertIdInt
            })
            .into('fcmtokenalertrelation')
            .returning('alertid')
            .then((alertId : any) => res.sendStatus(200))
            .catch((err : any) => console.error(err));
        })
        .catch((err: any) => console.error(err));
    } 
}