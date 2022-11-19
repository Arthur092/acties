import React from "react";
import { Appbar, Menu, Provider } from "react-native-paper";
import { getHeaderTitle } from '@react-navigation/elements';
import { Pressable, View } from "react-native";
import { TabBarIcon } from ".";
import { useAuth } from "../hooks/useAuth";

interface Props {
  options: Record<string, string>,
  route: Record<string, string>,
  navigation: any,
}
export const Header = ({ options, route, navigation }: Props) => {
    const title = getHeaderTitle(options, route.name);
    const { signout, user } = useAuth();
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const signOut = async () => {
      try {
        await signout();
      } catch (error) {
        console.log("$$$ - error", error);
      }
    }

    const goToActivities = () => {
      navigation.navigate('ActivitiesScreen');
      closeMenu();
    }

    return (
      <Appbar.Header>
        <View style={{zIndex: 100 }}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Appbar.Action icon="menu" color="white" onPress={openMenu} />
              }
              >
              <Menu.Item title='Menu' />
              <Menu.Item icon="check-circle" title="Activities" onPress={goToActivities}/>
              <Menu.Item icon="account" title={user?.email} />
              <Menu.Item icon="logout" onPress={signOut} title="Sign out" />
            </Menu>
        </View>
        <Appbar.Content title={title} />
        <Pressable
          onPress={signOut}
          style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
          })}>
          <TabBarIcon name="logout" color='white' />
        </Pressable>
      </Appbar.Header>
    )}