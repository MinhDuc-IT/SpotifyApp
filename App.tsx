import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AuthContext from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import api from './src/services/api';
import StartScreen from './src/screens/StartScreen';
import BottomTabNavigator from './src/components/BottomTabNavigator';
import LibraryScreenTest from './src/screens/LibraryScreenTest';
import CreatePlaylistScreen from './src/screens/CreatePlaylistScreen';
import SearchDetailScreen from './src/screens/SearchDetailScreen';
import { LibraryProvider } from './src/contexts/LibraryContext';
import LikedSongsScreen from './src/screens/LikedSongsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PlayerProvider } from './src/contexts/PlayerContext';
import SongInfoScreen from './src/screens/SongInfoScreen';
import GlobalPlayer from './src/components/GlobalPlayer';
import { PlayerProviderV2 } from './src/contexts/PlayerContextV2';
import { setupPlayer, registerPlaybackService } from './src/services/trackPlayer.service';
import { PlayerScreen } from './src/screens/PlayerScreen';
import PlaylistScreen from './src/screens/PlaylistScreen';

const Stack = createNativeStackNavigator();
registerPlaybackService();

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Xử lý auth state và refresh token
  const handleAuthStateChanged = async (
    user: FirebaseAuthTypes.User | null,
  ) => {
    console.log('[Auth] User state changed:', user ? user.email : 'null');
    if (
      user &&
      (user.emailVerified || user.providerData[0]?.providerId !== 'password')
    ) {
      try {
        setLoading(true);
        const tokenResult = await user.getIdTokenResult(true);
        console.log('Token fetched:', tokenResult.token);

        await api.post('/auth/setCustomClaims', { IdToken: tokenResult.token });
        //await api.post('/auth/setCustomClaims', { userId: user.uid });

        // Chờ một chút trước khi làm mới token (tránh việc claims chưa cập nhật)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Force refresh token để nhận claims mới nhất
        const updatedTokenResult = await user.getIdTokenResult(true);

        console.log('Updated token result:', updatedTokenResult);

        // Xác định roles dựa trên claim 'roles'
        setRoles(updatedTokenResult.claims.roles || []);

        // Cập nhật header API

        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${tokenResult.token}`;
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

  useEffect(() => {
    const initialize = async () => {
      await setupPlayer();
      //registerPlaybackService();
    };
    initialize();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={{ user, roles }}>
        <PlayerProvider>
          <PlayerProviderV2>
            <LibraryProvider>
              <View style={{flex: 1}}>
                <NavigationContainer>
                  <Stack.Navigator>
                    {!isEmailVerifiedOrFacebook() ? (
                      <>
                        <Stack.Screen
                          name="Start"
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
                      </>
                    ) : (
                      <>
                        <Stack.Screen
                          name="MainApp"
                          component={BottomTabNavigator}
                          options={{ headerShown: false }}
                        />
                      </>
                    )}
                    <Stack.Screen
                      name="LibraryScreenTest"
                      component={LibraryScreenTest}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="CreatePlaylist"
                      component={CreatePlaylistScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="SearchDetail"
                      component={SearchDetailScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Liked"
                      component={LikedSongsScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Info"
                      component={SongInfoScreen}
                      options={{ headerShown: false }}
                    />
                    {/* <Stack.Screen
                      name="PlayList"
                      component={PlaylistScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Player"
                      component={PlayerScreen}
                      options={{ headerShown: false }}
                    /> */}
                  </Stack.Navigator>
                </NavigationContainer>
                  <GlobalPlayer />
              </View>
            </LibraryProvider>
          </PlayerProviderV2>
        </PlayerProvider>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
};

export default App;
