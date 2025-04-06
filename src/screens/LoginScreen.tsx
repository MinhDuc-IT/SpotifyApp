import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AuthContext from '../contexts/AuthContext';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Config from 'react-native-config';
import BackButton from '../components/BackButton';
import ActionButton from '../components/ActionButton';
import InputField from '../components/InputField';

// Khởi tạo Google Sign-In
GoogleSignin.configure({
    webClientId: Config.WEB_CLIENT_ID,
});

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user, roles } = useContext(AuthContext);
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);

            console.log("Checking Play Services...");
            await GoogleSignin.hasPlayServices();
            console.log("Play Services are available.");

            console.log("Attempting to sign in...");
            const signInResult = await GoogleSignin.signIn();
            console.log("Sign in successful, result:", signInResult);

            console.log("Getting tokens...");
            const idToken = signInResult.data?.idToken;

            if (!idToken) {
                throw new Error('No ID token found');
            }
            console.log("ID Token:", idToken);

            console.log("Creating Google Credential...");
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            console.log("Google Credential created:", googleCredential);

            console.log("Signing in with Google Credential...");
            await auth().signInWithCredential(googleCredential);
            console.log("Sign-in with credential successful!");

        } catch (error: any) {
            console.log("Error occurred:", error);  // Log the error details
            Alert.alert('Google Sign In Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            await auth().signInWithEmailAndPassword(email, password);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (user) return null;

    return (
        <View style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />

            <View style={styles.containerForm}>
                <Text style={styles.title}>Sign in</Text>

                <InputField
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <InputField
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <ActionButton
                    isLoading={isLoading}
                    label="Sign In"
                    onPress={handleLogin}
                />
                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.separatorText}>OR</Text>
                    <View style={styles.separatorLine} />
                </View>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    <Text style={styles.googleButtonText}>
                        {isLoading ? 'Processing...' : 'Sign In with Google'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signupLinkContainer}
                    onPress={() => navigation.navigate('SignUp')} // Navigate to SignUpScreen
                >
                    <Text style={styles.signupLinkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View >

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
        // borderColor: '#ddd',
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
    },
    googleButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    signupLinkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signupLinkText: {
        color: '#4285F4',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;