
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet  } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { numberValidator } from '../helpers/validators';
import { theme } from '../core/theme';
import { Text } from 'react-native'
import { createRecord, deleteRecord, updateRecord } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { ActivityType, RecordType } from "../constants/Types";
import DatePicker from 'react-native-date-picker'
import { Timestamp } from 'firebase/firestore';

interface Props {
  visible: boolean;
  showDialog: (value: boolean) => void;
  currentActivity?: ActivityType | null;
  setSnackBar: React.Dispatch<React.SetStateAction<{
    visible: boolean;
    message: string;
    error: boolean;
  }>>,
  recordData?: RecordType | null
}

export const RecordDialog = ({ visible, showDialog, currentActivity, setSnackBar, recordData }: Props) => {
  const { user } = useAuth();

  const [number, setNumber] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date);
  const [numberError, setNumberError] = useState<string | undefined>(undefined);
  const [openDate, setOpenDate] = useState(false);
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    setNote(recordData?.note ?? "");
    setNumber(recordData?.quantity?.toString()  ?? "");
    const currentDate = recordData?.date ? recordData.date as Timestamp : null;
    setDate(currentDate ? new Date(currentDate.seconds * 1000) : new Date);
  },[recordData])

  const dismissDialog = () => {
    setNumber("");
    setDate(new Date);
    setOpenDate(false);
    showDialog(false);
  }

  const onChanged = (number: string)=>  {
    const numberError = numberValidator(number);
    setNumberError(numberError)
    const newNumber = number.replace(/[^0-9.]/g, '')
    setNumber(newNumber);
  }

  const onDismissSingle = useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpenDate(false);
      setDate(params);
    },
    [setOpenDate, setDate]
  );

  const onSubmit = async () => {
    if(currentActivity?.isQuantity){
      const numberError = numberValidator(number);
      if(numberError){
        setNumberError(numberError)
        return
      }
    }
    try {
      if(currentActivity){
        if(recordData){
          await updateRecord({
            id: recordData.id,
            activity: currentActivity,
            date,
            quantity: parseFloat(number),
            userId: user!.uid,
            note,
            activityId: currentActivity.id!
          })
          setSnackBar({visible: true, message: 'Record edited successfuly!', error: false})
        } else {
          await createRecord({
            activity: currentActivity,
            date,
            quantity: parseFloat(number),
            userId: user!.uid,
            note,
            activityId: currentActivity.id!
          })
          setSnackBar({visible: true, message: 'New record added successfuly!', error: false})
        }
      }
    } catch (error) {
      setSnackBar({visible: true, message:'Oppp!, an error ocurred', error: true});
      console.log("$$$ - error", error);
    }
    dismissDialog()
  }

  const onDelete = async () => {
    if(recordData){
      await deleteRecord(recordData);
      setSnackBar({visible: true, message:'Record deleted succesfully!', error: false});
    }
    dismissDialog()
  };

  return (
    <>
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
                  label={currentActivity.currency ?? "L."}
                  value={number}
                  onChangeText={onChanged}
                  placeholder='eg. 500'
                  mode='outlined'
                  autoComplete={false}
                  error={numberError ? true : false}
                />
              )
            }
            {
              currentActivity?.isNote && (
                <TextInput
                  testID='input-note'
                  label="Note"
                  value={note}
                  onChangeText={setNote}
                  placeholder='eg. details'
                  mode='outlined'
                  autoComplete={false}
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
            <Button onPress={() => setOpenDate(true)} uppercase={false} mode="outlined">
               Change Date
            </Button>
            {openDate &&
              <DatePicker
                modal
                open={openDate}
                date={date}
                onConfirm={onConfirmSingle}
                onCancel={onDismissSingle}
                mode={"date"}
              />
            }
          </Dialog.Content>
          <Dialog.Actions>
            <Button testID='dialog-cancel-button' onPress={dismissDialog}>Cancel</Button>
            <Button testID='dialog-done-button' onPress={onSubmit}>{recordData ? 'Save' : 'Done'}</Button>
            {recordData &&
              <Button testID='dialog-delete-button' onPress={onDelete}>Delete</Button>
            }
          </Dialog.Actions>
        </Dialog>
        </Portal>
      </View>
    </>
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