// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import { RootStackParamList } from '../types/navigation';
// import LibraryScreen from '../screens/LibraryScreen';
// import HomeScreen from '../screens/HomeScreen';

// const Tab = createBottomTabNavigator<RootStackParamList>();

// const BottomTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName: string;

//           if (route.name === 'Home') {
//             iconName = 'home-outline';
//           }

//           if (route.name === 'Library') {
//             iconName = 'library-outline';
//           }

//           return <Ionicons name={iconName!} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: 'tomato',
//         tabBarInactiveTintColor: 'gray',
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Library" component={LibraryScreen} />
//     </Tab.Navigator>
//   );
// };

// export default BottomTabNavigator;
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text, View} from 'react-native';
import LibraryScreen from '../screens/LibraryScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchDetailScreen from '../screens/SearchDetailScreen';
import {RootStackParamList} from '../types/navigation';
import PlaylistScreen from '../screens/PlaylistScreen';

const Tab = createBottomTabNavigator<RootStackParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size, focused}) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search-outline' : 'search';
          } else if (route.name === 'Premium') {
            iconName = focused ? 'search-outline' : 'search';
          } else if (route.name === 'PlayList') {
            iconName = focused ? 'library' : 'library-outline';
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarLabel: ({focused, color}) => (
          <Text style={{color: focused ? '#FFFFFF' : '#E5E5E5', fontSize: 10}}>
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: '#000000',
          height: 60,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#B3B3B3',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="PlayList" component={PlaylistScreen} />
      <Tab.Screen name="Premium" component={SearchDetailScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
