import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp(
  JSON.parse(atob(process.env.REACT_APP_FIREBASE_CONFIG))
);

const firebaseAuth = getAuth(app);

export { firebaseAuth };
