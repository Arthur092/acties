import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider, Divider, List } from 'react-native-paper';
import { AddRecordDialog } from '../components/NewRecordDialog';
import { useThemeColor } from '../components/Themed';

export default function NewActivity() {
  const [isDialogVisile, setIsDialogVisile] = React.useState(false);
  const showDialog = (value: boolean) => setIsDialogVisile(value);

  const itemOnPress = () => {
    showDialog(true);
  }

  return (
    <Provider>
      <List.Section>
        <Divider />
          <List.Item
            title="Gas"
            left={() => <List.Icon icon="gas-station" color='red'/>}
            right={() => <List.Icon icon="plus"/>}
            onPress={() => showDialog(true)}
            style={styles(useThemeColor).list}
            />
        <Divider />
          <List.Item
            title="Haircut"
            left={() => <List.Icon icon="account-star" color='blue'/>}
            right={() => <List.Icon icon="plus"/>}
            onPress={() => showDialog(true)}
            style={styles(useThemeColor).list}
            />
        <Divider />
          <List.Item
            title="Bank Visit"
            left={() => <List.Icon icon="bank" color='darkorange'/>}
            right={() => <List.Icon icon="plus"/>}
            onPress={() => showDialog(true)}
            style={styles(useThemeColor).list}
            />
        <Divider />
      </List.Section>
      <AddRecordDialog
        visible={isDialogVisile}
        showDialog={showDialog}
        />
    </Provider>
  );
}

const styles = (theme: Function) => StyleSheet.create({
  list: {
    backgroundColor: theme({}, 'background')
  }
});
