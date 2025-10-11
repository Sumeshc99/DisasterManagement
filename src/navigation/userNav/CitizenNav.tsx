import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigation from '../TabNavigation';

const Stack = createNativeStackNavigator();

export default function CitizenNav() {
  return (
    <Stack.Navigator
      initialRouteName="tabNavigation"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 400,
      }}
    >
      <Stack.Screen name="tabNavigation" component={TabNavigation} />
    </Stack.Navigator>
  );
}
