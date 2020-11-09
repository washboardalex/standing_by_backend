import { coinApiWebsocket } from './constants';
import WebSocket from 'ws';
import { db } from '../db/db';
// import { Message } from 'firebase-admin';
import {messaging} from 'firebase-admin';
import {firebaseAdmin} from './firebase/firebase';

let priceWebSocket : WebSocket; 


const addWebSocketListeners = (priceWebSocket : WebSocket) => {

    const currencies = priceWebSocket.url.split('?')[1].split(',');
    currencies[0] = currencies[0].replace('assets=', '');
    
    console.log(currencies);

    priceWebSocket.on('open', function open() {
        console.log('Websocket connection successfully opened.');
    });

    priceWebSocket.on('message', async function incoming(data : any) {

        console.log('typeof data is : ');
        console.log(typeof data);
        console.log('the data itself is: ')
        console.log(data);
        console.log('json parse of data is:')
        console.log(JSON.parse(data));

        data = JSON.parse(data);
        
        //str to number for price vals
        let updatedCurrencies : Array<string> = [];
        for (let i = 0, len = currencies.length; i < len; ++i) {
            const key = currencies[i];
            if (data[key]) {
                data[key] = Number(data[key]);
                updatedCurrencies.push(key);
            }
        }

        console.log('Incoming data from websocket connection: ');
        console.log(data);
        console.log('getting data from database');
        const alerts = await db('alert')
            .join('coin', 'coin.coinid', 'alert.coinid')
            .join('fcmtokenalertrelation', 'fcmtokenalertrelation.alertid', 'alert.alertid')
            .join('fcmtoken', 'fcmtoken.fcmtokenid', 'fcmtokenalertrelation.fcmtokenid')
            .select('*')
            .whereIn('name', updatedCurrencies);

        console.log('Database join command: ');
        console.log(alerts);
        console.log('please also take note of new message events');

        for (let i = 0, len = alerts.length; i < len; ++i) {
            const alert = alerts[i];
            console.log(alert);
            let conditionMet = false;
            if (alert.type === 'price') {
                const thresholdValue = Number(alert.value);
                switch (alert.condition) {
                    case 'greaterThan':
                        if (data[alert.name] > thresholdValue)
                            conditionMet = true;
                        console.log('greaterThan selected');
                        break;
                    case 'lessThan':
                        if (data[alert.name] < thresholdValue)
                            conditionMet = true;
                        console.log('lessThan selected');
                        break;
                    default:
                        console.error('No types match in alert object');
                }
                
                console.log('JUST CHECKING THE TOKEN');
                console.log(alert.token);

                if (conditionMet) {
                    console.log('Sending Alert');
                    const message : messaging.Message = {
                        data: {
                            price: 'itsjustatestalert',
                            threshold: thresholdValue.toString(),
                            condition: 'its a test dont worry about value for now'
                        },
                        notification: {
                            title: 'Basic Notification',
                            body: 'This is a basic notification sent from the server!',
                            imageUrl: 'https://my-cdn.com/app-logo.png',
                        },
                        token: alert.token
                    }

                    firebaseAdmin.messaging().send(message)
                        .then((response) => {
                            // Response is a message ID string.
                            console.log('Successfully sent message:', response);
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                        });
                }
                    
            }
        }

        
    });
}



export const configureCoinApiWebSocket = async () => {

    //configure the way you get the stream.

    const coinsWithAlert = await db('coinwithactivealert')
        .join('coin', 'coin.coinid', 'coinwithactivealert.coinid')
        .select('coin.name');
        // .catch((err : any) => console.error(err))
    console.log('coinsWithAlert is : ');
    console.log(coinsWithAlert);

    if (!!coinsWithAlert.length) {

        const arrayReducer = (accumulator : any, currentValue : any) => accumulator + currentValue.name + ',';
        let coinsWithAlertString = coinsWithAlert.reduce(arrayReducer, '');
        coinsWithAlertString = coinsWithAlertString.substring(0, coinsWithAlertString.length - 1);
        console.log('coinsWithAlertString is : ')
        console.log(coinsWithAlertString);

        const webSocketQry = `/prices?assets=${coinsWithAlertString}`;

        console.log(coinApiWebsocket + webSocketQry);

        priceWebSocket = new WebSocket(coinApiWebsocket + webSocketQry);
        
        console.log('Web Socket Successfully created - Check: ');
        console.log(priceWebSocket);

        addWebSocketListeners(priceWebSocket);
    }
}   

export const updateWebSocket = (coinName : string) => {
    console.log('updating websocket');
    let urlStr = priceWebSocket.url;
    console.log(urlStr);
    console.log('now close the websocket');
    priceWebSocket.close();
    priceWebSocket = new WebSocket(urlStr + `,${coinName}`);
    addWebSocketListeners(priceWebSocket);
}

