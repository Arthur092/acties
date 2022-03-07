import React from "react";
import { Appbar, Menu } from "react-native-paper";
import { getHeaderTitle } from '@react-navigation/elements';
import { Pressable } from "react-native";
import { TabBarIcon } from ".";
import { useAuth } from "../hooks/useAuth";

export const Header = ({ options, visible, closeMenu, openMenu, route }: any) => {
    const title = getHeaderTitle(options, route.name);
    const { signout, user } = useAuth();

    const signOut = async () => {
        try {
          await signout();
        } catch (error) {
          console.log("$$$ - error", error);
        }
      }

    return (
    <Appbar.Header>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu} />
          }>
          <Menu.Item title='Menu' />
          <Menu.Item icon="account" title={user?.email} />
          <Menu.Item icon="logout" onPress={signOut} title="Sign out" />
        </Menu>
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