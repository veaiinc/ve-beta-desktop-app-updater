import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const firebaseMessaging = getMessaging(app);

export default firebaseMessaging;
