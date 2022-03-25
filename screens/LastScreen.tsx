import moment from 'moment';
import { ViewStyle } from 'react-native';
import { useEffect, useState } from 'react';
import { DataTable, List } from 'react-native-paper';
import { RecordType } from '../constants/SampleData';
import { useActivities } from '../hooks/useActivities';
import { Timestamp } from '@firebase/firestore-types'
import { useThemeColor } from '../components/Themed';

const LastScreen = () => {
  const [records, setRecords] = useState<Record<string, RecordType>>({});
  const { records: fetchRecords } = useActivities();

  useEffect(() => {
    const initialRecords: Record<string, RecordType> = fetchRecords.data.reduce((acc: Record<string, RecordType>, element: RecordType) => {
      const existingElement = Object.keys(acc).find(el => el === element.activity.name)
      if(existingElement){
        if((element.date as Timestamp).toMillis() > (acc[existingElement].date as Timestamp).toMillis()){
          acc = Object.assign(acc, {[existingElement]: element})
        }
      }else {
        acc = Object.assign(acc, {[element.activity.name]: element})
      }

      return acc;
    }, {});
    setRecords(initialRecords);
  }, [fetchRecords]);

  return (
    <DataTable style={styles.table(useThemeColor)}>
      <DataTable.Header style={styles.header(useThemeColor)}>
        <DataTable.Title>Icon</DataTable.Title>
        <DataTable.Title>Activity</DataTable.Title>
        <DataTable.Title numeric>Number</DataTable.Title>
        <DataTable.Title numeric>date</DataTable.Title>
      </DataTable.Header>
      { Object.entries(records).map(([name, element], index) => (
        <DataTable.Row key={index}>
          <DataTable.Cell><List.Icon icon={element.activity.iconName} color={element.activity.iconColor}/></DataTable.Cell>
          <DataTable.Cell>{name}</DataTable.Cell>
          <DataTable.Cell numeric>{ element.quantity }</DataTable.Cell>
          <DataTable.Cell numeric>{moment((element.date as Timestamp).toDate()).format('ll')}</DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
}

const styles = {
  table: (theme: any): ViewStyle => {
    return { backgroundColor: theme({}, 'backgroundTable')}
  },
  header: (theme: any): ViewStyle => {
    return { backgroundColor: theme({}, 'background')}
  },
};

export default LastScreen;