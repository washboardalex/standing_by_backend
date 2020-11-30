import {Request, Response} from 'express';

export const deleteAlert = async (req: Request, res : Response, db:any) => {
    const { fcmTokenId, alertId } = req.body;

    console.log('the stuff we got is: ')
    console.log(fcmTokenId, alertId);

    res.status(200);
}

