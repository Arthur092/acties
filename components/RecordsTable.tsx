import moment from 'moment';
import { ViewStyle } from 'react-native';
import { DataTable, List } from 'react-native-paper';
import { RecordType } from "../constants/Types";
import { Timestamp } from '@firebase/firestore-types'
import { useThemeColor } from '../components/Themed';

type Props = {
    records: Array<RecordType>
    showTotal?: boolean
    onPress?: (element: RecordType) => void
}

export const RecordsTable = ({ records, showTotal, onPress }: Props) => {
  const total = records.reduce((acc, record) => {
    acc += record.quantity ?? 0
    return acc;
  }, 0)
    return (
    <DataTable style={styles.table(useThemeColor)}>
        <DataTable.Header style={styles.header(useThemeColor)}>
            <DataTable.Title style={{flex: 0.5}}>Icon</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>Activity</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>Number</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>date</DataTable.Title>
        </DataTable.Header>
        { records.map((element, index) => (
            <DataTable.Row
              key={index}
              onPress={onPress ? () => onPress(element) : () => {}}>
            <DataTable.Cell style={styles.icon}><List.Icon icon={element.activity.iconName} color={element.activity.iconColor}/></DataTable.Cell>
            <DataTable.Cell style={{justifyContent: 'right'}}>{element.activity.name}</DataTable.Cell>
            <DataTable.Cell style={{justifyContent: 'center'}}>{element.activity.currency ?? 'L. '} {element.quantity}</DataTable.Cell>
            <DataTable.Cell style={{justifyContent: 'center'}}>{moment((element.date as Timestamp).toDate()).format('l')}</DataTable.Cell>
            </DataTable.Row>
        ))}
        {
          showTotal && (
            <DataTable.Row style={{ backgroundColor: useThemeColor({}, 'background') }} key={'total'}>
              <DataTable.Cell style={{justifyContent: 'left'}}>Total</DataTable.Cell>
              <DataTable.Cell style={{justifyContent: 'left'}}>L. {total}</DataTable.Cell>
              <DataTable.Cell style={{justifyContent: 'left'}}></DataTable.Cell>
              <DataTable.Cell style={{justifyContent: 'center'}}></DataTable.Cell>
            </DataTable.Row>
          )
        }
    </DataTable>
    )
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