import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider, Divider, List } from 'react-native-paper';
import { AddRecordDialog } from '../components/NewRecordDialog';
import { useThemeColor } from '../components/Themed';
import { useActivities } from '../hooks/useActivities';

export function NewActivityScreen(){
  const [isDialogVisile, setIsDialogVisile] = useState(false);
  const showDialog = (value: boolean) => setIsDialogVisile(value);
  const { activityTypes } = useActivities();

  return (
    <Provider>
      <List.Section>
        {activityTypes.data.map((activity, index) => (
          <View key={index}>
            <Divider />
            <List.Item
              title={activity.name}
              left={() => <List.Icon icon={activity.iconName} color={activity.iconColor}/>}
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
