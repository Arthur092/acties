import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
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
import { Header } from './Header';

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
  const { getActivityTypes, activityTypes, getRecords, records } = useActivities();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    getActivityTypes();
    getRecords();
  },[]);

  return <BottomTab.Navigator
      initialRouteName="ActivityTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        header: ({ options, route }: any) => (
          <Header
            options={options}
            route={route}
            visible={visible}
            closeMenu={closeMenu}
            openMenu={openMenu}
        />
        )
      }}>
      <BottomTab.Screen
        name="ActivityTab"
        component={activityTypes.isLoading ? ActivitySpinner : NewActivityScreen}
        options={() => ({
          title: 'New Activity',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="LastTab"
        component={records.isLoading ? ActivitySpinner : LastScreen}
        options={{
          title: 'Historical',
          tabBarIcon: ({ color }) => <TabBarIcon name="chart-line" color={color} />,
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
export function TabBarIcon(props: {
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
