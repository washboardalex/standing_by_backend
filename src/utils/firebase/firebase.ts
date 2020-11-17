import {initializeApp, credential, ServiceAccount} from 'firebase-admin';
import firebaseAccountCredentials from './covid19alerts-firebase-adminsdk-qsk8z-f6e73d8a61.json';

const serviceAccount = firebaseAccountCredentials as ServiceAccount;

export const firebaseAdmin = initializeApp({
    credential: credential.cert(serviceAccount),
    databaseURL: 'https://covid19app-e680a.firebaseio.com'
});

console.log('firebase admin initialised');

console.log(firebaseAdmin);

