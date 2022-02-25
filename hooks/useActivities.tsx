import { collection, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useState, useContext, createContext, useEffect } from "react";
import { ActivityType, RecordType } from "../constants/SampleData";
import { db, getActivityTypesByUser, getRecordsByUser } from "../firebase";
import { useAuth } from "./useAuth";

interface ContextValue {
    activityTypes: ActivityTypesState;
    records: RecordsState;
    getActivityTypes: Function;
    getRecords: Function
}

type ActivityTypesState = {
    data: Array<ActivityType>;
    isLoading: Boolean;
}

export type RecordsState = {
    data: Array<RecordType>;
    isLoading: Boolean;
}

const ActivitiesContext = createContext<ContextValue>({
    activityTypes: {
        data: [],
        isLoading: true
    },
    records: {
        data: [],
        isLoading: true
    },
    getActivityTypes: () => null,
    getRecords: () => null,
});

interface Props {
    children: JSX.Element
}

export function ProvideActivities({ children }: Props) {
    const activities: ContextValue = useProvideActivities();

    return (
        <ActivitiesContext.Provider value={activities}>
            { children }
        </ActivitiesContext.Provider>
    )
}

export const useActivities = () => useContext(ActivitiesContext);

function useProvideActivities(): ContextValue {
    const { user } = useAuth();
    const [newRecord, setNewRecord] = useState<RecordType | null>(null);

    useEffect(() => {
        const queryListener = query(collection(db, "Record"));
        const unsubscribe = onSnapshot(queryListener, (querySnapshot) => {
            querySnapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    const { activityType, date, quantity, userId } = change.doc.data();
                    const newRecord = {
                        id: change.doc.id,
                        activity: activityType,
                        date,
                        quantity,
                        userId
                    }
                    getDoc(newRecord.activity).then(activity => {
                        setNewRecord({
                            ...newRecord,
                            activity: activity.data() as ActivityType
                        });
                    });
                }
            })
        });

        return () => unsubscribe();
    },[]);

    useEffect(() => {
        if(newRecord){
            setRecords({
                ...records,
                data: [
                    ...records.data,
                    newRecord
                ],
            })
        }
    },[newRecord])

    const [activityTypes, setActivityTypes] = useState<ActivityTypesState>({
        data: [],
        isLoading: true
    });
    const [records, setRecords] = useState<RecordsState>({
        data: [],
        isLoading: true
    });

    const getActivityTypes = () => {
        if (user) {
            const { uid } = user;
            return getActivityTypesByUser(uid).then(newActivityTypes => {
                setActivityTypes({
                    ...activityTypes,
                    data: newActivityTypes,
                    isLoading: false
                })
            });
        }
    }

    const getRecords = () => {
        if (user) {
            const { uid } = user;
            return getRecordsByUser(uid).then(newRecords => {
                setRecords({
                    ...records,
                    data: newRecords,
                    isLoading: false
                })
            });
        }
    }

    return {
        activityTypes,
        records,
        getActivityTypes,
        getRecords
    }
}


