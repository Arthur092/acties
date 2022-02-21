import moment from 'moment';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { DataTable, List } from 'react-native-paper';
import { Records, RecordType } from '../constants/SampleData';

const optionsPerPage = [2, 3, 4];

const LastScreen = () => {
  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  const [records, setRecords] = useState<Record<string, RecordType>>({});

  useEffect(() => {
    const initialRecords: Record<string, RecordType> = Records.reduce((acc: Record<string, RecordType>, element: RecordType) => {
      const existingElement = Object.keys(acc).find(el => el === element.activity.name)
      if(existingElement){
        if(moment(element.date) > moment(acc[existingElement].date)){
          acc = Object.assign(acc, {[existingElement]: element})
        }
      }else {
        acc = Object.assign(acc, {[element.activity.name]: element})
      }

      return acc;
    }, {});
    setRecords(initialRecords);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title style={styles.firstCell}>Activity</DataTable.Title>
        <DataTable.Title numeric>Number</DataTable.Title>
        <DataTable.Title numeric>date</DataTable.Title>
      </DataTable.Header>
      { Object.entries(records).map(([name, element], index) => (
        <DataTable.Row key={index}>
          <DataTable.Cell style={styles.firstCell}><List.Icon icon={element.activity.iconName} color={element.activity.iconColor}/> { name }</DataTable.Cell>
          <DataTable.Cell numeric>{ element.quantity }</DataTable.Cell>
          <DataTable.Cell numeric>{moment(element.date).format('ll')}</DataTable.Cell>
        </DataTable.Row>
      ))}

      {/* <DataTable.Pagination
        page={page}
        numberOfPages={0}
        onPageChange={(page) => setPage(page)}
        // label="1-2 of 6"
        // numberOfItemsPerPage={itemsPerPage}
        // numberOfItemsPerPageList={[1,2,3]}
        // onItemsPerPageChange={setItemsPerPage}
        // selectPageDropdownLabel={'Rows per page'}
      /> */}
    </DataTable>
  );
}

const styles = StyleSheet.create({
  firstCell: {
    flex: 1.3,
  }
});

export default LastScreen;