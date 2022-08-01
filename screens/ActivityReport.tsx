import moment, { Moment } from 'moment';
import { ScrollView, View, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DataTable, FAB, IconButton, Text } from 'react-native-paper';
import { ActivityType, RecordType } from "../constants/Types";
import { useActivities } from '../hooks/useActivities';
import { Timestamp } from '@firebase/firestore-types'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button } from 'react-native-paper';
import { RecordsTable } from '../components/RecordsTable'
import { useThemeColor } from '../components/Themed';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityReport'> & { activity: ActivityType };

const ActivityReport = ({ route } : Props) => {
  const [records, setRecords] = useState<Array<RecordType>>([]);
  const [monthlyViewDate, setMonthlyViewDate] = useState<Date | null>(null);
  const { records: fetchedRecords } = useActivities();
  const [monthlyRecords, setMonthlyRecords] = useState<Array<RecordType>>([]);
  const { activity } = route.params;
  console.log('\x1b[36m$$$ ~ monthlyViewDate', monthlyViewDate);

  useEffect(() => {
    const initialRecords: Array<RecordType> = fetchedRecords.data.reduce((acc: Array<RecordType>, element: RecordType) => {
      if(element.activity.id === activity.id ){
       acc.push(element)
      }
      return acc;
    }, []);
    initialRecords.sort((a,b) => {
      return (b.date as Timestamp).toMillis() - (a.date as Timestamp).toMillis();
    });
    setRecords(initialRecords);
  }, [fetchedRecords]);

  const onMontlyView = () => {
    const currentDate = moment().toDate();
    setMonthlyViewDate(currentDate);
    let currentMonthRecords = [];
    if(activity.monthDay){
      const currentMonthDay = moment(currentDate).endOf('day').date(activity.monthDay!);
      const nextMonthDay = moment(currentDate).endOf('day').add(1, 'months').date(activity.monthDay!)
      currentMonthRecords = records.filter(record => {
        const recordDate = moment((record.date as Timestamp).toDate());
        return recordDate > currentMonthDay && recordDate <= nextMonthDay
      })
    } else {
      currentMonthRecords = records.filter(record => moment((record.date as Timestamp).toDate()).month() === moment(currentDate).month())
    }
    setMonthlyRecords(currentMonthRecords);
  }

  const onRegularView = () => {
    setMonthlyViewDate(null);
    setMonthlyRecords([]);
    setRecords(records);
  }

  const onChangeMonth = (right: boolean) => {
    let currentMonthRecords = [];
    let newMonthDate: Moment;
    if(right){
      newMonthDate = moment(monthlyViewDate)!.add(1, 'months');
    }else {
      newMonthDate = moment(monthlyViewDate)!.subtract(1, 'months');;
    }
    if(activity.monthDay){
      const currentMonthDay = moment(newMonthDate).endOf('day').date(activity.monthDay!);
      const nextMonthDay = moment(newMonthDate).endOf('day').add(1, 'months').date(activity.monthDay!)
      currentMonthRecords = records.filter(record => {
        const recordDate = moment((record.date as Timestamp).toDate());
        return recordDate > currentMonthDay && recordDate <= nextMonthDay
      })
    } else {
      currentMonthRecords = records.filter(record => moment((record.date as Timestamp).toDate()).month() === newMonthDate.month())
    }
    setMonthlyViewDate(newMonthDate.toDate());
    setMonthlyRecords(currentMonthRecords);
  };

  return (
    <>
      <ScrollView>
      { monthlyViewDate && (
        <View style={styles.monthlyContainer}>
          <IconButton
            icon="arrow-left"
            style={styles.monthlyItem}
            size={20}
            onPress={() => onChangeMonth(false)}
          />
          { activity.monthDay ? (
            <>
              <Text style={styles.monthlyText}>{activity.monthDay}th {moment(monthlyViewDate).format('MMM')}/{moment(monthlyViewDate).add(1, 'months').format('MMM')} - {moment(monthlyViewDate).format('YYYY')}</Text>
            </>) : (
            <>
              <Text style={styles.monthlyText}>{moment(monthlyViewDate).format('MMMM')} - {moment(monthlyViewDate).format('YYYY')}</Text>
            </>)
          }
          <IconButton
            icon="arrow-right"
            style={styles.monthlyItem}
            size={20}
            onPress={() => onChangeMonth(true)}
          />
        </View>
      )}
      <RecordsTable
        records={monthlyViewDate ? monthlyRecords : records}
        showTotal={true}
      />
    </ScrollView>
    <Button mode='outlined' style={styles.floatButton(useThemeColor)} onPress={monthlyViewDate ? onRegularView : onMontlyView}>
      {monthlyViewDate ? "Regular View" : "Mothly View"}
    </Button>
  </>
  );
}

const styles = {
  monthlyContainer: {
    flexDirection: 'row',
    paddingTop: '27px',
    paddingBottom: '12px',

  },
  monthlyItem: {
    flex: 1,
  },
  monthlyText: {
    flex: 2,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    paddingTop: 9
  },
  floatButton: (theme: any): ViewStyle => {
    return {
      backgroundColor: theme({}, 'background'),
      position: 'absolute',
      right: 10,
      bottom: 10,
    }
  },
};

export default ActivityReport;