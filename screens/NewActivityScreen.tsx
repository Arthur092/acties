import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider, Divider, List } from 'react-native-paper';
import { AddRecordDialog } from '../components/NewRecordDialog';
import { useThemeColor } from '../components/Themed';
import { Activities } from '../constants/SampleData';

export default function NewActivityScreen() {
  const [isDialogVisile, setIsDialogVisile] = React.useState(false);
  const showDialog = (value: boolean) => setIsDialogVisile(value);

  return (
    <Provider>
      <List.Section>
        {Activities.map((activity, index) => (
          <View key={index}>
            <Divider />
            <List.Item
            title={activity.name}
            left={() => <List.Icon icon={activity.icon} color={activity.color}/>}
            right={() => <List.Icon icon="plus"/>}
            onPress={() => activity.isQuantity ? showDialog(true) : null}
            style={styles(useThemeColor).list}
            />
          </View>
        ))}
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
    backgroundColor: theme({}, 'background'),
  }
});
