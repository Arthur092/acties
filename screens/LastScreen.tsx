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
        <DataTable.Title style={{flex: 0.5}}>Icon</DataTable.Title>
        <DataTable.Title style={{justifyContent: 'center'}}>Activity</DataTable.Title>
        <DataTable.Title style={{justifyContent: 'center'}}>Number</DataTable.Title>
        <DataTable.Title style={{justifyContent: 'center'}}>date</DataTable.Title>
      </DataTable.Header>
      { Object.entries(records).map(([name, element], index) => (
        <DataTable.Row key={index}>
          <DataTable.Cell style={styles.icon}><List.Icon icon={element.activity.iconName} color={element.activity.iconColor}/></DataTable.Cell>
          <DataTable.Cell style={{justifyContent: 'right'}}>{name}</DataTable.Cell>
          <DataTable.Cell style={{justifyContent: 'center'}}>{ element.quantity }</DataTable.Cell>
          <DataTable.Cell style={{justifyContent: 'center'}}>{moment((element.date as Timestamp).toDate()).format('l')}</DataTable.Cell>
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
  icon: {
    flex: 0.5,
    marginLeft: '-14px'
  },
};

export default LastScreen;