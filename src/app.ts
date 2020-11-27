import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';

import { db } from './db/db';
import { setFCMToken } from './controllers/setFCMToken';
import { createAlert } from './controllers/createAlert';
import { setAlertUsersJob } from './jobs/alertUsers';
import {getAlerts} from './controllers/getAlerts';


const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

setAlertUsersJob();

app.post('/token', async (req : Request, res : Response) => setFCMToken(req, res, db, bcrypt) );//add bcrypt later
app.post('/alert', async (req : Request, res : Response) => createAlert(req, res, db) );
app.get('/alert/:id', async (req : Request, res : Response) => getAlerts(req, res, db) );

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server is listening on ${port}`));
