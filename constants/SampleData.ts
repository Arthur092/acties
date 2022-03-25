import { Timestamp } from '@firebase/firestore-types'

export type ActivityType = {
  id?: string
  name: string;
  isQuantity: boolean;
  iconName: string;
  iconColor: string;
  userId?: string | null;
}

export type RecordType = {
  id?: string,
  activity: ActivityType;
  date: Date | Timestamp;
  quantity: number | null;
  userId: string | null;
  activityId: string
}

export const Activities: Array<ActivityType> = [
  {
    name: 'Gas',
    isQuantity: true,
    iconName: 'gas-station',
    iconColor: 'red',
    userId: null,
  },
  {
    name: 'Supermarket',
    isQuantity: true,
    iconName: 'shopping',
    iconColor: 'mediumpurple',
    userId: null,
  },
]

