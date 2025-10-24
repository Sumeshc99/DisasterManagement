// src/redux/persistConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistConfig } from 'redux-persist';

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'profileAuth', 'language', 'location'],
};

export default persistConfig;
