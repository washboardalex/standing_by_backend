import {Request, Response} from 'express';
import { IAlert } from '../../models/IAlert';
import { ExistingAlertDbFormat, formatExistingAlertView } from './utils';

export const getAlerts = async (req: Request, res : Response, db:any) => {
    const { id } = req.params;

    const alerts = await db('alert')
                    .join('country', 'country.country_id', 'alert.country_id')
                    .join('fcmtokenalertrelation', 'fcmtokenalertrelation.alert_id', 'alert.alert_id')
                    .join('fcmtoken', 'fcmtoken.fcm_token_id', 'fcmtokenalertrelation.fcm_token_id')
                    .select('*')
                    .where('fcmtoken.fcm_token_id', id);


    let newAlerts = alerts.map((alert : ExistingAlertDbFormat) : IAlert => formatExistingAlertView(alert));

    res.status(200).json(newAlerts);
}

