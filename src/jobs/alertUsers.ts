import * as cron from 'node-cron';
import axios, { AxiosResponse, AxiosError } from 'axios';

import { covidApiUrl, headers } from '../utils/constants';
import { formatCountries, greaterThan, lessThan, getKeyValue } from '../utils/functions';
import ICountrySummary from '../models/covidapi/ICountrySummary';
import { AlertType, AlertCondition } from '../models/IAlert';
import { fArgReturn } from '../utils/types';
import { messaging } from 'firebase-admin';
import { firebaseAdmin } from '../utils/firebase/firebase';
import { db } from '../db/db';
import { backOff } from "exponential-backoff";
import {logger} from '../app';


const generateAlertMessage = (alert : any, country : ICountrySummary) => {
    let conditionMsg : string = alert.type as AlertType === 'newDeaths' ? country.newDeaths.toString() : country.newConfirmed.toString(); //potentially becomes a switch

    const typeMsg : string = alert.type as AlertType === 'newDeaths' ? 'deaths' : 'cases'; //potentially becomes a switch

    return `There were ${conditionMsg} new confirmed ${typeMsg} in ${country.country} today.`;
}

export const setAlertUsersJob = () => cron.schedule('* * * * *', function() {

    //check if the api has been updated since last time
    //if it has then run the below

    const axiosConfig = { headers };    
    //get updated country data
    axios.get(`${covidApiUrl}/summary`, axiosConfig)
        .then(async (response : AxiosResponse)  =>  {
            if (response.status === 200 && response.data) {

                logger.info('this is the response: ');
                logger.info(response.data);
                logger.info(response.data.Countries);
                const allCountrySummary : Array<ICountrySummary> = formatCountries(response.data.Countries);
                
                // get all the alerts
                const alerts = await db('alert')
                    .join('country', 'country.country_id', 'alert.country_id')
                    .join('fcmtokenalertrelation', 'fcmtokenalertrelation.alert_id', 'alert.alert_id')
                    .join('fcmtoken', 'fcmtoken.fcm_token_id', 'fcmtokenalertrelation.fcm_token_id')
                    .select('*');

                //you should probably format the alerts here to get the database notation out of the way - then you can use 
                //typescript appropriately
                
                // compare the conditions, if conditions met, send a firebase cloud message
                for (let i = 0; i < alerts.length; i++) {
                    const alert = alerts[i];

                    let comparisonOperator : fArgReturn = alert.condition === 'greaterThan' ? greaterThan : lessThan;

                    const type : AlertType = alert.type; 

                    for (let n = 0; n < allCountrySummary.length; n++) {

                        const country : ICountrySummary = allCountrySummary[n];
                        
                        if (alert.country_name === country.country) {

                            const isConditionMet : boolean = comparisonOperator(getKeyValue<keyof ICountrySummary, ICountrySummary>(type)(country), alert.value);

                            if (isConditionMet) {
                                //send firebase cloud message
                                const message : messaging.Message = {
                                    notification: {
                                        title: 'New Covid-19 Numbers',
                                        body: generateAlertMessage(alert, country)
                                    },
                                    token: alert.token
                                }

                                backOff(() => firebaseAdmin.messaging().send(message)
                                    .then((response) => {
                                        logger.info('Alert sent successfully: ', response);
                                    })
                                    .catch((error) => {
                                        logger.error('Error sending alert:');
                                        logger.error(error);
                                    })
                                );
                            }
                        }
                    }
                }
            }
        })
        .catch((error : AxiosError) => {
            logger.error(error);
        });    
});

