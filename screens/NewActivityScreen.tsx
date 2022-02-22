import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider, Divider, List, Snackbar } from 'react-native-paper';
import { AddRecordDialog } from '../components/NewRecordDialog';
import { useThemeColor } from '../components/Themed';
import { ActivityType } from '../constants/SampleData';
import { useActivities } from '../hooks/useActivities';
import { theme as coreTheme} from '../core/theme'

export function NewActivityScreen(){
  const [isDialogVisile, setIsDialogVisile] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const [snackBar, setSnackBar] = useState({visible: false, message: '', error: false});

  const showDialog = (value: boolean, activity: ActivityType | null = null) => {
    if(activity){
      setCurrentActivity(activity);
    }
    setIsDialogVisile(value);
  };
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
              onPress={() => showDialog(true, activity)}
              style={styles(useThemeColor).list}
            />
          </View>
        ))}
        <Divider />
      </List.Section>

      <AddRecordDialog
        visible={isDialogVisile}
        showDialog={showDialog}
        currentActivity={currentActivity}
        setSnackBar={setSnackBar}
      />
      <Snackbar
        visible={snackBar.visible}
        onDismiss={() => setSnackBar({...snackBar, visible: false})}
        style={snackBar.error ? styles(useThemeColor).snackBarError : styles(useThemeColor).snackBarSuccess}
        >
          {snackBar.message}
      </Snackbar>
    </Provider>
  );
}

const styles = (theme: Function) => StyleSheet.create({
  list: {
    backgroundColor: theme({}, 'background'),
  },
  snackBarError: {
    backgroundColor: coreTheme.colors.error
  },
  snackBarSuccess: {
    backgroundColor: coreTheme.colors.success
  },
});
