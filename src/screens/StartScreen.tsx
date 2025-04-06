import React from 'react';
import { SafeAreaView, Image, StyleSheet, Text, View, ScrollView} from 'react-native';
import AuthButton from '../components/AuthButton';

const StartScreen: React.FC = () => {
    const filePath = require('../assets/images/image-fotor-20250404214212.png');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Image source={filePath} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Millions of Songs.</Text>
                    <Text style={styles.text}>Free on Spotify.</Text>
                </View>
                <AuthButton />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    scrollView: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    image: {
        height: undefined,
        width: '100%',
        aspectRatio: 1,
    },
    textContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    }
});

export default StartScreen;
