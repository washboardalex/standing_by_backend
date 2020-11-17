import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import axios, { AxiosResponse, AxiosError } from 'axios';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { db } from './db/db';
import * as cron from 'node-cron';
import { setFCMToken } from './controllers/setFCMToken';
import { createAlert } from './controllers/createAlert';
import { covidApiUrl, headers } from './utils/constants';
import { formatCountries, greaterThan, lessThan, getKeyValue } from './utils/functions';
require('dotenv').config();
import ICountrySummary from './models/covidapi/ICountrySummary';
import { fArgReturn } from './utils/types';
import { messaging } from 'firebase-admin';
import { firebaseAdmin } from './utils/firebase/firebase';

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

//run through alerts and send alerts as required
cron.schedule('* 9/12 * * *', function() {

    const axiosConfig = { headers };    
    //get updated country data
    axios.get(`${covidApiUrl}/summary`, axiosConfig)
        .then(async (response : AxiosResponse)  =>  {
            if (response.status === 200 && response.data) {
                console.log('The data from the api call: ');
                console.log(response.data);

                const allCountrySummary : Array<ICountrySummary> = formatCountries(response.data.Countries);
                
                // get all the alerts
                const alerts = await db('alert')
                    .join('country', 'country.country_id', 'alert.country_id')
                    .join('fcmtokenalertrelation', 'fcmtokenalertrelation.alert_id', 'alert.alert_id')
                    .join('fcmtoken', 'fcmtoken.fcm_token_id', 'fcmtokenalertrelation.fcm_token_id')
                    .select('*');

                console.log('alerts are : ');
                console.log(alerts);
                
                // compare the conditions, if conditions met, send a firebase cloud message
                for (let i = 0; i < alerts.length; i++) {
                    const alert = alerts[i];

                    let comparisonOperator : fArgReturn;
                    switch (alert.condition) {
                        case 'greaterThan':
                            comparisonOperator = greaterThan;
                            break;
                        case 'lessThan':
                            comparisonOperator = lessThan
                            break;
                        default:
                            comparisonOperator = greaterThan;
                    }

                    const type : keyof ICountrySummary = alert.type; //this is veeeeery bad - youll need to fix, add a model or something

                   

                    for (let n = 0; n < allCountrySummary.length; n++) {

                        console.log('looping')

                        const country : ICountrySummary = allCountrySummary[n];
                        
                        if (alert.country_name === country.country) {
                            console.log('alert condition: ', alert.condition)
                            console.log('type: ', alert.type)
                            console.log(type)
                            console.log('condition check')
                            const isConditionMet : boolean = comparisonOperator(getKeyValue<keyof ICountrySummary, ICountrySummary>(type)(country), alert.value);

                            console.log('alert value:', alert.value)
                            console.log('country value: ', getKeyValue<keyof ICountrySummary, ICountrySummary>(type)(country))

                            console.log('is condition met: ', isConditionMet);
                            if (isConditionMet) {
                                //send firebase cloud message
                                console.log('condition met!!!');
                                console.log('device id: ');
                                console.log(alert.token);
                                console.log('fuckit heres the whole alert');
                                console.log(alert);
                                console.log('Sending Alert');
                                const message : messaging.Message = {
                                    data: {
                                        country: country.country,
                                        threshold: alert.value.toString(),
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
                }
            }
        })
        .catch((error : AxiosError) => {
            console.error(error);
        });
    
    

    
});


app.post('/token', async (req : Request, res : Response) => setFCMToken(req, res, db, bcrypt) );//add bcrypt later
app.post('/alert', async (req : Request, res : Response) => createAlert(req, res, db) );

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server is listening on ${port}`));
