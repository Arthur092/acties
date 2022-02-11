
import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Provider, TextInput } from 'react-native-paper';

interface Props {
  visible: boolean;
  showDialog: (value: boolean) => void;
}

export const AddRecordDialog = ({ visible, showDialog }: Props) => {
  const [text, setText] = React.useState("");

  return (
    <Provider>
      <View>
        <Portal>
        <Dialog visible={visible} onDismiss={() => showDialog(false)}>
            <Dialog.Content>
            <TextInput
              label="Details"
              value={text}
              onChangeText={text => setText(text)}
              placeholder='eg. 123'
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