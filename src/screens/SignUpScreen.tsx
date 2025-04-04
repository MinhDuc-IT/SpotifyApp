// src/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import BackButton from '../components/BackButton';
import ActionButton from '../components/ActionButton';
import InputField from '../components/InputField';

// Khởi tạo Google Sign-In
GoogleSignin.configure({
    webClientId: Config.WEB_CLIENT_ID,
});

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            await GoogleSignin.hasPlayServices();
            const signInResult = await GoogleSignin.signIn();

            const tokens = await GoogleSignin.getTokens();

            const idToken = tokens.idToken;
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);

            Alert.alert('Success', 'Account created successfully!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Google Sign Up Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        try {
            setIsLoading(true);
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);

            // Send verification email
            await userCredential.user.sendEmailVerification();
            await auth().signOut();
            Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.');
            navigation.goBack();
        } catch (error: any) {
            let message = 'Sign up failed. Please try again.';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'Email already in use';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address';
                    break;
                case 'auth/weak-password':
                    message = 'Password is too weak';
                    break;
            }
            Alert.alert('Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <View style={styles.containerForm}>
                <Text style={styles.title}>Create New Account</Text>

                <InputField
                    label="What’s your email?"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <InputField
                    label="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <InputField
                    label="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <ActionButton
                    isLoading={isLoading}
                    label="Sign Up"
                    onPress={handleEmailSignUp}
                />

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerForm: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff'
    },
    label: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    input: {
        height: 50,
        // borderColor: '#77777',
        // borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#777777',
        color: 'white',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    separatorText: {
        marginHorizontal: 10,
        color: '#666',
    },
    googleButton: {
        backgroundColor: '#4285F4',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    googleButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginLink: {
        alignSelf: 'center',
    },
    loginLinkText: {
        color: '#4285F4',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;