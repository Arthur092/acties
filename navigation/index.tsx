import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { NewActivityScreen } from '../screens/NewActivityScreen';
import LastScreen from '../screens/LastScreen';
import { RootStackParamList, RootTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { ActivityIndicator, Colors as ActivityColors, List } from 'react-native-paper';
import { LoginScreen, RegisterScreen, StartScreen } from '../screens/Authentication';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useActivities } from '../hooks/useActivities';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Stack.Navigator>
      {user ? (
        <>
        <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
        </>) : (
        <>
        <Stack.Screen name="StartScreen" component={StartScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: 'Register' }} />
        </>
        )
      }
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { signout } = useAuth();
  const { getActivityTypes, activityTypes } = useActivities();

  useEffect(() => {
    getActivityTypes();
  },[]);


  const signOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.log("$$$ - error", error);
    }
  }

  return <BottomTab.Navigator
      initialRouteName="ActivityTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="ActivityTab"
        component={activityTypes.isLoading ? ActivitySpinner : NewActivityScreen}
        options={() => ({
          title: 'New Activity',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={signOut}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <TabBarIcon name="logout" />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="LastTab"
        component={LastScreen}
        options={{
          title: 'Historical',
          tabBarIcon: ({ color }) => <TabBarIcon name="chart-line" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={signOut}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <TabBarIcon name="logout" />
            </Pressable>
          ),
        }}
      />
    </BottomTab.Navigator>
}

function ActivitySpinner() {
  return <ActivityIndicator
      animating={true}
      size='large'
      color={ActivityColors.purpleA200}
      style={styles.spinner} />
}
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: string;
  color?: string;
}) {
  return <List.Icon icon={props.name} color={props.color}/>;
}

const styles = StyleSheet.create({
  spinner: {
    justifyContent: 'center',
    flex: 1,
  }
})
