import { Timestamp } from '@firebase/firestore-types';

export type ActivityType = {
  id?: string;
  name: string;
  isQuantity: boolean;
  iconName: string;
  iconColor: string;
  userId?: string | null;
  monthDay?: number;
};

export type RecordType = {
  id?: string;
  activity: ActivityType;
  date: Date | Timestamp;
  quantity: number | null;
  userId: string | null;
  activityId: string;
};
