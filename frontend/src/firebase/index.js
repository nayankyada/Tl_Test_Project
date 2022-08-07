import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD7w2pMTi-K7G80WGBmC8zQU91fN3MiUL8',
  authDomain: 'bikes-rental-a4d84.firebaseapp.com',
  projectId: 'bikes-rental-a4d84',
  storageBucket: 'bikes-rental-a4d84.appspot.com',
  messagingSenderId: '878408463885',
  appId: '1:878408463885:web:96f6e3623be84e7a614744',
  measurementId: 'G-Y4DVP1G271'
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export default db;
export { auth, provider };
