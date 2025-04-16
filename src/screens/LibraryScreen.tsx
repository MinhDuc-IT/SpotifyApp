import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import HeaderLibrary from '../components/library/HeaderLibrary';
import LibraryContent from '../components/library/LibraryContent';
import {useLibrary} from '../contexts/LibraryContext';

export type LibraryItem = {
  id: string;
  name: string;
  category: 'artist' | 'playlist' | 'album' | 'podcast' | 'song';
  author?: string;
  lastUpdate?: string;
  imageUrl?: string;
};

const LibraryScreen = () => {
  const {libraryItems} = useLibrary();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <HeaderLibrary />
        <LibraryContent libraryItems={libraryItems} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginVertical: 20,
    borderWidth: 1,
    height: '100%',
  },
});

export default LibraryScreen;
