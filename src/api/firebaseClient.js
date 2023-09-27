import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDKGBspzaqoh-QaqjBjEBD5LicfvEUAEcQ',
  authDomain: 'gyfted-staging-56987.firebaseapp.com',
  projectId: 'gyfted-staging-56987',
  storageBucket: 'gyfted-staging-56987.appspot.com',
  messagingSenderId: '872088973444',
  appId: '1:872088973444:web:fe525782f50333d5ab12d1',
  measurementId: 'G-0D5CM9GWJ3',
};

const app = initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);

export { firebaseAuth };
