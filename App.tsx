import { LogBox, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainIndex from './src/MainIndex';

import { Provider } from 'react-redux';
import { Persistor, Store } from './src/store/Store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  LogBox.ignoreAllLogs();
  return (
    <Provider store={Store}>
      <PersistGate
        // loading={<ActivityIndicator />}
        persistor={Persistor}
      >
        <SafeAreaProvider>
          <MainIndex />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
