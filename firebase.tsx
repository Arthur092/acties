import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { ActivityType, RecordType } from "./constants/Types";
import { getActivityWithId } from './helpers/utils';

const prodConfig = {
  apiKey: 'AIzaSyDlVfIs_a_XCwx3fSxYlsRyktAdqJE0sgc',
  authDomain: 'acties-f8e89.firebaseapp.com',
  databaseURL: 'https://acties-f8e89-default-rtdb.firebaseio.com',
  projectId: 'acties-f8e89',
  storageBucket: 'acties-f8e89.appspot.com',
  messagingSenderId: '606075828354',
  appId: '1:606075828354:web:2262a0bd4c88eca1f31c9b',
}

const devConfig = {
  apiKey: "AIzaSyB9xMhcbdoYlV9MMF4RtnIdch8mYsa3MRg",
  authDomain: "acties-dev.firebaseapp.com",
  projectId: "acties-dev",
  storageBucket: "acties-dev.appspot.com",
  messagingSenderId: "481435189705",
  appId: "1:481435189705:web:6e086abbf7fc59316ba818"
}

// web app's Firebase configuration
const firebaseConfig = {
  ...prodConfig
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
  return addDoc(collection(db, "Record"), {...rest, activityType: activityDoc})
};

// Get Records by user
export const getRecordsByUser = async (userId: string) => {
  const q = query(collection(db, "Record"), where("userId", "==", userId));
  const SnapshotRecords = await getDocs(q);
  const newRecords: Array<any> = [];

  SnapshotRecords.forEach(async (doc) => {
    const { activityType, date, quantity } = doc.data();
    newRecords.push({
      id: doc.id,
      activity: activityType,
      date,
      quantity,
      userId,
    });
  });

  const newRecordPromises = newRecords.map(async record => {
    const fetchActivity = await getDoc(record.activity);
    return {
      ...record,
      activity: getActivityWithId(fetchActivity)
    }
  });

  return Promise.all(newRecordPromises)
}