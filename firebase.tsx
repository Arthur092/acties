import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, doc } from "firebase/firestore";
import { ActivityType, RecordType } from './constants/SampleData';

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
const db = getFirestore(app);

// Create ActivityType
export const createActivityType = (data: ActivityType) => addDoc(collection(db, "ActivityType"), data);

// Get ActivityTypes by user
export const getActivityTypesByUser = async (userId: string) => {
  const q = query(collection(db, "ActivityType"), where("userId", "==", userId));
  const SnapshotActivityTypes = await getDocs(q);
  const newActivityTypes: Array<ActivityType> = [];
  SnapshotActivityTypes.forEach((doc) => {
      const { name, isQuantity, iconName, iconColor, userId} = doc.data();
      newActivityTypes.push({
          id: doc.id,
          name,
          isQuantity,
          iconName,
          iconColor,
          userId,
      });
    });
  return newActivityTypes
}

// Create Record
export const createRecord = (data: RecordType) => {
  const { activity, ...rest } = data;
  const activityDoc = doc(db, "ActivityType", activity.id!);
  return addDoc(collection(db, "Record"), {...rest, ActivityType: activityDoc})
};

// Get ActivityTypes by user
export const getRecordsByUser = async (userId: string) => {
  const q = query(collection(db, "Record"), where("userId", "==", userId));
  const SnapshotRecords = await getDocs(q);
  const newRecords: Array<RecordType> = [];
  SnapshotRecords.forEach((doc) => {
      const { ActivityType, date, quantity } = doc.data();
      newRecords.push({
          id: doc.id,
          activity: ActivityType,
          date,
          quantity,
          userId,
      });
    });
  return newRecords
}