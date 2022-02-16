import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDlVfIs_a_XCwx3fSxYlsRyktAdqJE0sgc',
  authDomain: 'acties-f8e89.firebaseapp.com',
  databaseURL: 'https://acties-f8e89-default-rtdb.firebaseio.com',
  projectId: 'acties-f8e89',
  storageBucket: 'acties-f8e89.appspot.com',
  messagingSenderId: '606075828354',
  appId: '1:606075828354:web:2262a0bd4c88eca1f31c9b',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
