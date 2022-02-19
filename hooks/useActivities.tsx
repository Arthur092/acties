import React, { useState, useContext, createContext } from "react";
import { ActivityType, RecordType } from "../constants/SampleData";
import { getActivityTypesByUser } from "../firebase";
import { useAuth } from "./useAuth";

interface ContextValue {
    activityTypes: ActivityTypesState;
    // records: Array<RecordType>;
    getActivityTypes: Function;
}

type ActivityTypesState = {
    data: Array<ActivityType>;
    isLoading: Boolean;
}

const ActivitiesContext = createContext<ContextValue>({
    activityTypes: {
        data: [],
        isLoading: true
    },
    // records: [],
    getActivityTypes: () => null,
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

export const useActivities = () => {
    return useContext(ActivitiesContext);
}

function useProvideActivities(): ContextValue {
    const { user } = useAuth();
    const [activityTypes, setActivityTypes] = useState<ActivityTypesState>({
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

    return {
        activityTypes,
        // records,
        getActivityTypes,
    }
}


