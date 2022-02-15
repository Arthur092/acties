export type ActivityType = {
  name: string;
  isQuantity: boolean;
  icon: string;
  color: string;
  userId: string | null;
}

export const Activities: Array<ActivityType> = [
  {
    name: 'Gas',
    isQuantity: true,
    icon: 'gas-station',
    color: 'red',
    userId: null,
  },
  {
    name: 'Supermarket',
    isQuantity: true,
    icon: 'shopping',
    color: 'mediumpurple',
    userId: null,
  },
  {
    name: 'Haircut',
    isQuantity: true,
    icon: 'account-star',
    color: 'blue',
    userId: null,
  },
  {
    name: 'Bank Visit',
    isQuantity: false,
    icon: 'bank',
    color: 'darkorange',
    userId: null,
  }
]

export type RecordType = {
  activity: ActivityType;
  date: string;
  quantity: number | null;
  userId: string | null;
}

export const Records: Array<RecordType> = [
  {
    activity: {
      name: 'Supermarket',
      isQuantity: true,
      icon: 'shopping',
      color: 'mediumpurple',
      userId: null,
    },
    date: '12-12-2021',
    quantity: 1300,
    userId: '1'
  },
  {
    activity: {
      name: 'Supermarket',
      isQuantity: true,
      icon: 'shopping',
      color: 'mediumpurple',
      userId: null,
    },
    date: '12-30-2021',
    quantity: 1700,
    userId: '1'
  },
  {
    activity: {
      name: 'Gas',
      isQuantity: true,
      icon: 'gas-station',
      color: 'red',
      userId: null,
    },
    date: '12-30-2021',
    quantity: 1700,
    userId: '1'
  },
  {
    activity: {
      name: 'Gas',
      isQuantity: true,
      icon: 'gas-station',
      color: 'red',
      userId: null,
    },
    date: '01-14-2022',
    quantity: 1900,
    userId: '1'
  },
]