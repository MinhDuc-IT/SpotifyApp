import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screens/LibraryScreen';
import DownLoadScreen from '../screens/DownLoadScreen';

export type LibraryStackParamList = {
  Library: undefined;
  DownLoad: undefined;
};

const Stack = createNativeStackNavigator<LibraryStackParamList>();

const LibraryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DownLoad" component={DownLoadScreen} />
    <Stack.Screen name="Library" component={LibraryScreen} />
  </Stack.Navigator>
);

export default LibraryStack;
