import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Text} from 'react-native';
import LibraryScreen from '../screens/LibraryScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchDetailScreen from '../screens/SearchDetailScreen';
import {RootStackParamList} from '../types/navigation';
import LikedSongsScreen from '../screens/LikedSongsScreen';
import PremiumOfferScreen from '../screens/PremiumOfferScreen';

const Tab = createBottomTabNavigator<RootStackParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size, focused}) => {
          let iconName = '';

          if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Thư viện') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Tìm kiếm') {
            iconName = focused ? 'search-outline' : 'search';
          } else if (route.name === 'Premium') {
            iconName = focused ? 'spotify' : 'spotify';
            return <Entypo name={iconName} size={25} color={color} />;
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
          height: 70,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#B3B3B3',
        headerShown: false,
      })}>
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Tìm kiếm" component={SearchScreen} />
      <Tab.Screen name="Thư viện" component={LibraryScreen} />
      {/* <Tab.Screen name="Premium" component={SearchDetailScreen} /> */}
      {/* <Tab.Screen
        name="Liked"
        component={LikedSongsScreen}
        options={{
          tabBarButton: () => null,
          tabBarStyle: {display: 'none'},
        }}
      />
      /> */}
      <Tab.Screen name="Premium" component={PremiumOfferScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
