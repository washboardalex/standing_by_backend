import {initializeApp, credential, ServiceAccount} from 'firebase-admin';
import firebaseAccountCredentials from './crypto-alerts-ce595-firebase-adminsdk-g8efc-3353416112.json';

const serviceAccount = firebaseAccountCredentials as ServiceAccount;

export const firebaseAdmin = initializeApp({
    credential: credential.cert(serviceAccount),
    databaseURL: 'https://crypto-alerts-ce595.firebaseio.com'
});

console.log('firebase admin initialised');

console.log(firebaseAdmin);

