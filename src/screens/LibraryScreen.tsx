import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import HeaderLibrary from "../components/library/HeaderLibrary";
import LibraryContent from "../components/library/LibraryContent";

type LibraryItem = {
    id: string;
    name: string;
    category: 'artist' | 'playlist' | 'album' | 'podcast' | 'song';
    author?: string;
    lastUpdate?: string;
    imageUrl?: string;
};

const libraryItems: LibraryItem[] = [
    {
        id: '1',
        name: 'Chill Hits',
        category: 'playlist',
        author: 'Spotify',
        lastUpdate: '2025-04-10',
    },
    {
        id: '2',
        name: 'Ed Sheeran',
        category: 'artist',
    },
    {
        id: '3',
        name: '÷ (Deluxe)',
        category: 'album',
    },
    {
        id: '4',
        name: 'The Joe Rogan Experience',
        category: 'podcast',
    },
    {
        id: '5',
        name: 'Perfect',
        category: 'song',
        author: 'Ed Sheeran',
    },
    {
        id: '6',
        name: 'Workout Mix 2025',
        category: 'playlist',
        author: 'ABC',
        lastUpdate: '2025-04-13',
    },
    {
        id: '7',
        name: 'Taylor Swift',
        category: 'artist',
    },
    {
        id: '8',
        name: 'Anti-Hero',
        category: 'song',
        author: 'Taylor Swift',
    },
];

const LibraryScreen = () => {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <HeaderLibrary />
                <LibraryContent libraryItems={libraryItems}/>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        marginVertical: 20,
        borderWidth: 1,
        height: '100%',
    }
});

export default LibraryScreen;