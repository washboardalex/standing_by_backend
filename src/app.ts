import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import morgan from 'morgan';
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

if (process.env.ENVIRONMENT === 'dev') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('common', {
        stream: fs.createWriteStream('./src/logs/logs.txt', {flags: 'a'})
    }));
}




app.use(bodyParser.json());

setAlertUsersJob();

app.post('/token', async (req : Request, res : Response) => setFCMToken(req, res, db, bcrypt) );//add bcrypt later
app.post('/alert/create', async (req : Request, res : Response) => createAlert(req, res, db) );
app.get('/alert/read/:id', async (req : Request, res : Response) => getAlerts(req, res, db) );
app.post('/alert/delete', async (req : Request, res : Response) => deleteAlert(req, res, db) );


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server is listening on ${port}`));
