import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { db } from './db/db';
import { setFCMToken } from './controllers/setFCMToken';
import { createAlert } from './controllers/createAlert';
import { configureCoinApiWebSocket } from './utils/websocket';

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.post('/token', (req : Request, res : Response) => setFCMToken(req, res, db, bcrypt) );//add bcrypt later
app.post('/alert', async (req : Request, res : Response) => createAlert(req, res, db) );

configureCoinApiWebSocket();

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server is listening on ${port}`));



//websocket - probably need to deal with this.
// const pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,monero,litecoin');
// console.log('we are here');
// console.log(pricesWs);
    
// pricesWs.on('open', function open() {
//     console.log('Websocket connection successfully opened.');
// });

// pricesWs.on('message', function incoming(data) {
//     console.log('Incoming data from websocket connection: ');
//     console.log(data);
// });

