
import * as React from 'react';
import { useCallback, useState } from 'react';
import { View, StyleSheet  } from 'react-native';
import { Button, Dialog, Portal, Provider, TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { inputValidator } from '../helpers/validators';
import { theme } from '../core/theme';
import { Text } from 'react-native'

interface Props {
  visible: boolean;
  showDialog: (value: boolean) => void;
}

export const AddRecordDialog = ({ visible, showDialog }: Props) => {
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState<string | undefined>(undefined);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);

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

  const onSubmit = () => {
    const numberError = inputValidator(number);
    if(numberError){
      setNumberError(numberError)
      return
    }
    showDialog(false)
  }

  return (
    <Provider>
      <View>
        <Portal>
        <Dialog visible={visible} onDismiss={() => showDialog(false)}>
          <Dialog.Content>
            <View
              style={styles.input}
            >
            <TextInput
              label="Quantity"
              value={number}
              onChangeText={onChanged}
              placeholder='eg. 500'
              mode='outlined'
              autoComplete={false}
              error={numberError ? true : false}
            />
            {numberError ? <Text style={styles.error}>{numberError}</Text> : null}
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
            <Button onPress={onSubmit}>Done</Button>
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