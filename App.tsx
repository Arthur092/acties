import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
console.log('\x1b[36m$$$ ~ DefaultTheme', DefaultTheme);

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { ProvideAuth } from "./hooks/useAuth";
import { ProvideActivities } from './hooks/useActivities';

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#018786',
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#00B1B7'
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? lightTheme : darkTheme

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
        <PaperProvider theme={theme}>
          <ProvideAuth>
            <ProvideActivities>
              <SafeAreaProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
              </SafeAreaProvider>
            </ProvideActivities>
          </ProvideAuth>
        </PaperProvider>
    );
  }
}
