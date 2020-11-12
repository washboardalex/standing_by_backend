import {initializeApp, credential, ServiceAccount} from 'firebase-admin';
import firebaseAccountCredentials from './covid19app-e680a-firebase-adminsdk-k6u14-dfa3a5a3e6.json';

const serviceAccount = firebaseAccountCredentials as ServiceAccount;

export const firebaseAdmin = initializeApp({
    credential: credential.cert(serviceAccount),
    databaseURL: 'https://covid19app-e680a.firebaseio.com'
});

console.log('firebase admin initialised');

console.log(firebaseAdmin);

