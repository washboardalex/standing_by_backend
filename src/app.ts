import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import morgan from 'morgan';
import * as log4js from 'log4js';
import bcrypt from 'bcryptjs';
require('dotenv').config();
import * as fs from 'fs';

import { db } from './db/db';
import { setFCMToken } from './controllers/setFCMToken';
import { createAlert } from './controllers/alert/createAlert';
import { setAlertUsersJob } from './jobs/alertUsers';
import { getAlerts } from './controllers/alert/getAlerts';
import { deleteAlert } from './controllers/alert/deleteAlert'; 


const app = express();

//configure logging
if (process.env.ENVIRONMENT === 'dev') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('common', {
        stream: fs.createWriteStream('logs/morgan.log', {flags: 'a'})
    }));
}

log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: { type: 'file', filename: 'logs/developer.log' }
    },
    categories: {
        developer: { appenders: ['file', 'console'], level: 'info' },
        default: { appenders: ['console'], level: 'info' }
    }
});
export const logger = log4js.getLogger('developer');
app.use(log4js.connectLogger(logger, { level: 'info' }));

//bodyparser for post requests
app.use(bodyParser.json());

//set jobs
setAlertUsersJob();

//define api endpoints
app.post('/token', async (req : Request, res : Response) => setFCMToken(req, res, db, bcrypt) );//add bcrypt later
app.post('/alert/create', async (req : Request, res : Response) => createAlert(req, res, db) );
app.get('/alert/read/:id', async (req : Request, res : Response) => getAlerts(req, res, db) );
app.post('/alert/delete', async (req : Request, res : Response) => deleteAlert(req, res, db) );

//start app
const port = process.env.PORT || 3001;
app.listen(port, () => logger.info(`server is listening on ${port}`));
