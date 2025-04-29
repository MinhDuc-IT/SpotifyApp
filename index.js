/**
 * @format
 */
import 'react-native-gesture-handler';        // nếu bạn dùng gesture-handler
import 'react-native-reanimated';
import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
// import TrackPlayer from 'react-native-track-player';

function Main() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <App />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => Main);
