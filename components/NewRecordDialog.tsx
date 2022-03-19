
import * as React from 'react';
import { useCallback, useState } from 'react';
import { View, StyleSheet  } from 'react-native';
import { Button, Dialog, Portal, Provider, TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { inputValidator } from '../helpers/validators';
import { theme } from '../core/theme';
import { Text } from 'react-native'
import { createRecord } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { ActivityType } from '../constants/SampleData';

interface Props {
  visible: boolean;
  showDialog: (value: boolean, activity?: ActivityType) => void;
  currentActivity?: ActivityType | null;
  setSnackBar: Function
}

export const AddRecordDialog = ({ visible, showDialog, currentActivity, setSnackBar }: Props) => {
  const { user } = useAuth();

  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(new Date);
  const [open, setOpen] = useState(false);

  const dismissDialog = () => {
    setNumber("");
    setDate(new Date);
    showDialog(false)
  }

  const onChanged = (number: string)=>  {
    const numberError = inputValidator(number);
    setNumberError(numberError)
    const newNumber = number.replace(/[^0-9]/g, '')
    setNumber(newNumber);
  }

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  const onSubmit = async () => {
    if(currentActivity?.isQuantity){
      const numberError = inputValidator(number);
      if(numberError){
        setNumberError(numberError)
        return
      }
    }
    try {
      if(currentActivity){
        await createRecord({
          activity: currentActivity,
          date,
          quantity: parseInt(number),
          userId: user!.uid
        })
        setSnackBar({visible: true, message: 'New record added successfuly!', error: false})
      }
    } catch (error) {
      setSnackBar({visible: true, message:'Oppp!, an error ocurred', error: true});
      console.log("$$$ - error", error);
    }
    dismissDialog()
  }

  return (
    <Provider>
      <View>
        <Portal>
        <Dialog visible={visible} onDismiss={dismissDialog}>
          <Dialog.Content testID='new-record-dialog'>
            <View
              style={styles.input}
            >
            {
              currentActivity?.isQuantity && (
                <TextInput
                  testID='input-qty'
                  label="Quantity"
                  value={number}
                  onChangeText={onChanged}
                  placeholder='eg. 500'
                  mode='outlined'
                  autoComplete={false}
                  error={numberError ? true : false}
                />
              )
            }
            {numberError ? <Text testID='input-qty-error' style={styles.error}>{numberError}</Text> : null}
            </View>
            <TextInput
              label="Date"
              value={date?.toDateString()}
              mode='outlined'
              disabled={true}
              style={styles.input}
              autoComplete={false}
            />
            <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
               Change Date
            </Button>
            <DatePickerModal
              locale="en"
              mode="single"
              visible={open}
              onDismiss={onDismissSingle}
              date={date}
              onConfirm={onConfirmSingle}
              label="Select a date"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button testID='dialog-cancel-button' onPress={dismissDialog}>Cancel</Button>
            <Button testID='dialog-done-button' onPress={onSubmit}>Done</Button>
          </Dialog.Actions>
        </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingLeft: 10,
    paddingTop: 5
  },
})