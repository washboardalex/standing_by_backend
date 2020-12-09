import {Request, Response} from 'express';
import {logger} from '../../app';

export const deleteAlert = async (req: Request, res : Response, db:any) => {
    const { fcmTokenId, alertId } = req.body;

    let usersWithAlert = await db
            .count('fcm_token_id')
            .from('fcmtokenalertrelation')
            .where('alert_id', alertId)
            .catch((err : any) => {
                logger.error(err)
                res.status(500).json('server error');
            });

    usersWithAlert = Number(usersWithAlert[0].count);
    
    //delete in fcmtokenalert relation
    const deletion = await db('fcmtokenalertrelation')
            .where({
                'fcm_token_id': fcmTokenId,
                'alert_id': alertId
            })
            .del()
            .catch((err : any) => {
                logger.error(err);
                res.status(500).json('server error');
            });
    
    if (usersWithAlert > 1) {
        res.status(200).json(alertId);
        return;
    }

    // if there was only one user mapped to it also delete the alert
    const alertDeletion = await db('alert')
            .where('alert_id', alertId)
            .del()
            .catch((err : any) => {
                logger.error(err);
                res.status(500).json('server error');
            });

    res.status(200).json(alertId);
}

