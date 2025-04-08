import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_WIDTH = SCREEN_WIDTH * 0.85; // Chiếm 85% chiều rộng màn hình
const BUTTON_HEIGHT = 50;

// Khởi tạo Google Sign-In
GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
});

type StartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;

const AuthButton = () => {
  const navigation = useNavigation<StartScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSignUp = () => {
    //Alert.alert('Thông báo', 'Sign up');
    navigation.navigate('SignUp');
  }

  // const handleGoogleSignIn = () => {
  //   Alert.alert('Thông báo', 'Đăng nhập bằng Google');
  //   // Thêm logic xác thực Google tại đây
  //   // Ví dụ: Firebase, Auth0, hoặc API của bạn
  // };

  const handleFacebookSignIn = () => {
    Alert.alert('Thông báo', 'Đăng nhập bằng Facebook');
    // Thêm logic xác thực Facebook tại đây
  };

  // const handleAppleSignIn = () => {
  //   Alert.alert('Thông báo', 'Đăng nhập bằng Apple');
  //   // Thêm logic xác thực Apple tại đây
  // };

  const handleLogin = () => {
    //Alert.alert('Thông báo', 'Đăng nhập');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupText}>Sign up free</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn} disabled={isLoading}>
          {/* <FontAwesomeIcon name="google" size={20} color="#000" style={styles.icon} /> */}
          {/* <AntDesign name="google" size={20} color="#fff" style={styles.icon} /> */}
          <Image source={require('../assets/icons/icons8-google-48.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFacebookSignIn}>
          {/* <Icon name="facebook" size={20} color="#fff" style={styles.icon} /> */}
          <Image source={require('../assets/icons/icons8-facebook-logo-48.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.button} onPress={handleAppleSignIn}>
          <Icon name="apple" size={20} color="#000" style={styles.icon} />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.loginContainer} onPress={handleLogin}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text style={[styles.loginText, styles.loginLink]}>Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    // borderWidth: 1,
    // borderColor: 'white'
  },
  content: {
    flex: 1,
    //justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 25,
  },
  button: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 45,
    //paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 10,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  signupButton: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1ED760',
    //opacity: '100%',
    borderRadius: 45,
    paddingHorizontal: 25,
    marginBottom: 10,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    alignSelf: 'center',
  },
  signupText: {
    fontSize: 16,
    marginLeft: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  icon: {
    height: 20,
    width: 20,
    position: 'absolute',
    left: 30,
    //color: 'white',
    resizeMode: 'contain',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AuthButton;