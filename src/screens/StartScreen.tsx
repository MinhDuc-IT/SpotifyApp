import React from 'react';
import { SafeAreaView, Image, StyleSheet, Text, View, ScrollView} from 'react-native';
import AuthButton from '../components/AuthButton';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
        //alignItems: 'center',
        backgroundColor: '#121212',
    },
    scrollView: {
        alignItems: 'center',
        //paddingBottom: 20,
    },
    image: {
        height: height * 0.4,
        width: '100%',
        resizeMode: 'contain',
    },
    textContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: width > 400 ? 22 : 20,
        textAlign: 'center',
    }
});

export default StartScreen;
