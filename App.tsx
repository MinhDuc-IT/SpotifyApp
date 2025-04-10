import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AuthContext from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdminScreen from './src/screens/AdminScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import api from './src/services/api';
import StartScreen from './src/screens/StartScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Xử lý auth state và refresh token
  const handleAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    console.log('[Auth] User state changed:', user ? user.email : 'null');
    if (user && (user.emailVerified || user.providerData[0]?.providerId !== 'password')) {
      try {
        const tokenResult = await user.getIdTokenResult(true);
        console.log("Token fetched:", tokenResult.token);

        await api.post('/auth/setCustomClaims', { IdToken: tokenResult.token });
        //await api.post('/auth/setCustomClaims', { userId: user.uid });

        // Chờ một chút trước khi làm mới token (tránh việc claims chưa cập nhật)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Force refresh token để nhận claims mới nhất
        const updatedTokenResult = await user.getIdTokenResult(true);
        console.log("Updated token result:", updatedTokenResult);
        
        // Xác định roles dựa trên claim 'roles'
        setRoles(updatedTokenResult.claims.roles || []);

        // Cập nhật header API
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenResult.token}`;
      } catch (error) {
        console.error('Token refresh error:', error);
        console.error('Lỗi khi thiết lập claims hoặc làm mới token:', error);

      }
    } else {
      console.log('[Auth] User is null or email not verified');
      setRoles([]);
      delete api.defaults.headers.common['Authorization'];
    }
    setUser(user);
    setLoading(false);
  };

  const isEmailVerifiedOrFacebook = () => {
    if (!user) return false;
  
    const providerId = user.providerData[0]?.providerId;
  
    // Nếu là Facebook thì không cần emailVerified
    if (providerId === 'facebook.com') return true;
  
    // Các provider khác cần emailVerified
    return user.emailVerified;
  };
  

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(handleAuthStateChanged);
    return subscriber;
  }, []);
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, roles }}>
      {/* <StatusBar translucent={true}/> */}
      <NavigationContainer>
        <Stack.Navigator>
          {!isEmailVerifiedOrFacebook()? (
            <>
              <Stack.Screen
                name='Start'
                component={StartScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : roles.includes('Admin') ? (
            <>
              <Stack.Screen
                name="Admin"
                component={AdminScreen}
                options={{ headerShown: false }}
              />
              {/* <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              /> */}
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
