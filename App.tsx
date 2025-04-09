import { enableScreens } from 'react-native-screens';
enableScreens();

import React from 'react';
import { StatusBar } from 'react-native';
import { StyleSheet } from 'react-native';
import Navigation from './src/StackNavigator';
import { PlayerContext } from './src/PlayerContext';
import Modal from 'react-native-modal';

export default function App(): React.JSX.Element {
  return (
    <PlayerContext>
      <Navigation />
      <Modal isVisible={false}>
        <></>
      </Modal>
      <StatusBar barStyle="light-content" />
    </PlayerContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
