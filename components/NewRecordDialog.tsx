
import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Provider, TextInput } from 'react-native-paper';

interface Props {
  visible: boolean;
  showDialog: (value: boolean) => void;
}

export const AddRecordDialog = ({ visible, showDialog }: Props) => {
  const [number, setNumber] = React.useState("");

  const onChanged = (number: string)=>  {
    const newNumber = number.replace(/[^0-9]/g, '')
    setNumber(newNumber);
}

  return (
    <Provider>
      <View>
        <Portal>
        <Dialog visible={visible} onDismiss={() => showDialog(false)}>
            <Dialog.Content>
            <TextInput
                label="Quantity"
                value={number}
                onChangeText={onChanged}
                placeholder='eg. 500'
                mode='outlined'
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => showDialog(false)}>Done</Button>
            </Dialog.Actions>
        </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}