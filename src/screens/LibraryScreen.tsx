import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import HeaderLibrary from '../components/library/HeaderLibrary';
import LibraryContent from '../components/library/LibraryContent';
import {useLibrary} from '../contexts/LibraryContext';
import {useFocusEffect} from '@react-navigation/native';
import {getAllLibraryItems} from '../services/libraryService';

export type LibraryItem = {
  id: string;
  name: string;
  category: 'artist' | 'playlist' | 'album' | 'podcast' | 'song';
  author?: string;
  lastUpdate?: string;
  imageUrl?: string;
};

const LibraryScreen = () => {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [playListItems, setPlayListItems] = useState<LibraryItem[]>([]);
  // const {libraryItems} = useLibrary();

  useFocusEffect(
    useCallback(() => {
      getLibraryItems();
    }, []),
  );

  const getLibraryItems = async () => {
    let data = await getAllLibraryItems();
    const updatedPlayListItems = data.map((playlist: any) => ({
      id: playlist.playlistID.toString(),
      name: playlist.playlistName,
      category: 'playlist',
      imageUrl: playlist.songs[0]?.image,
      lastUpdate: playlist.createdDate,
    }));
    console.log('Updated Playlist Items:', updatedPlayListItems);
    setPlayListItems(updatedPlayListItems);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <HeaderLibrary />
        <LibraryContent libraryItems={playListItems} />
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
