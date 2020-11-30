import {Request, Response} from 'express';

export const deleteAlert = async (req: Request, res : Response, db:any) => {

    console.log(req.body);
    

    const { fcmTokenId, alertId } = req.body;

    console.log('the stuff we got is: ')
    console.log(fcmTokenId, alertId);

    const usersWithAlert = db
            .count('alert_id')
            .from('fcmtokenalertrelation')
            .where('alert_id', alertId);

    console.log(usersWithAlert)

}

