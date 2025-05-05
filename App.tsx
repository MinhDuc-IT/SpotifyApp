import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Linking, Alert, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AuthContext from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import api from './src/services/api';
import StartScreen from './src/screens/StartScreen';
import CreatePlaylistScreen from './src/screens/CreatePlaylistScreen';
import SearchDetailScreen from './src/screens/SearchDetailScreen';
import { LibraryProvider } from './src/contexts/LibraryContext';
import LikedSongsScreen from './src/screens/LikedSongsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PlayerProvider } from './src/contexts/PlayerContext';
import SongInfoScreen from './src/screens/SongInfoScreen';
import GlobalPlayer from './src/components/GlobalPlayer';
import { PlayerProviderV2 } from './src/contexts/PlayerContextV2';
import {
  setupPlayer,
  registerPlaybackService,
} from './src/services/trackPlayer.service';
import { PlayerScreen } from './src/screens/PlayerScreen';
import PlaylistScreen from './src/screens/PlaylistScreen';
import { createTables } from './src/sqlite/database';
import { checkAndCreateUser } from './src/sqlite/userService';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import DownLoadScreen from './src/screens/DownLoadScreen';
import LibraryStack from './src/navigation/libraryNavigator';
import LibraryScreen from './src/screens/LibraryScreen';
import LikedSongsDownload from './src/screens/LikedSongDownload';
import PremiumOfferScreen from './src/screens/PremiumOfferScreen';
import PaymentSuccess from './src/screens/PaymentSuccess';
import PaymentFailure from './src/screens/PaymentFailure';
import { navigationRef } from './src/navigation/navigationRef';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
registerPlaybackService();

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHandlingDeepLink, setIsHandlingDeepLink] = useState(false);

  // Xử lý auth state và refresh token
  const handleAuthStateChanged = async (
    user: FirebaseAuthTypes.User | null,
  ) => {
    // console.log('[Auth] User state changed:', user ? user.email : 'null');
    if (
      user &&
      (user.emailVerified || user.providerData[0]?.providerId !== 'password')
    ) {
      try {
        setLoading(true);
        const firebaseId = user.uid;
        const name = user.displayName || 'Unknown User';
        const email = user.email || 'unknown@example.com';

        try {
          // Kiểm tra và tạo user trong SQLite
          await checkAndCreateUser(firebaseId, name, email);
        } catch (error) {
          console.error('Error checking/creating user in SQLite:', error);
        }
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
    createTables();
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

  // useEffect(() => {
  //   const handleInitialUrl = async () => {
  //     const url = await Linking.getInitialURL();
  //     if (url) handleDeepLink(url);
  //   };

  //   const handleDeepLink = (url: string) => {
  //     if (url.includes('payment-success')) {
  //       navigationRef.current?.navigate('PaymentSuccess');
  //     } else if (url.includes('payment-failure')) {
  //       navigationRef.current?.navigate('PaymentFailure');
  //     } else {
  //       Alert.alert('Thông báo', `Mở bằng deeplink: ${url}`);
  //     }
  //   };

  //   const linkingListener = Linking.addEventListener('url', (event) => {
  //     handleDeepLink(event.url);
  //   });

  //   handleInitialUrl();

  //   return () => {
  //     linkingListener.remove();
  //   };
  // }, []);

  useEffect(() => {
    const handleInitialUrl = async () => {
      setIsHandlingDeepLink(true);
      const url = await Linking.getInitialURL();
      if (url) {
        await handleDeepLink(url); 
      } else {
        setIsHandlingDeepLink(false);
      }
      setIsHandlingDeepLink(false);
    };

    const handleDeepLink = async (url: string) => {
      console.log('Deep link received:', url);
      try {
        // Xử lý custom scheme thủ công
        const queryString = url.split('?')[1] || '';
        const params = queryString.split('&').reduce((acc: Record<string, string>, pair) => {
          const [key, value] = pair.split('=');
          if (key && value) {
            acc[decodeURIComponent(key)] = decodeURIComponent(value);
          }
          return acc;
        }, {});
    
        const payload = {
          transactionId: params.transactionId,
          amount: params.amount,
          orderCode: params.orderCode,
          message: params.message,
          paymentMethod: params.paymentMethod,
          orderDescription: params.orderDescription,
          transactionDate: params.transactionDate,
        };
    
        if (url.includes("payment-success")) {
          navigationRef.current?.navigate("PaymentSuccess", payload);
        } else if (url.includes("payment-failure")) {
          navigationRef.current?.navigate("PaymentFailure", payload);
        }
      } catch (error) {
        console.error("Lỗi xử lý deeplink:", error);
        Alert.alert("Lỗi", "Không thể xử lý đường dẫn deeplink.");
      } finally {
        setIsHandlingDeepLink(false);
      }
    };

    const linkingListener = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    handleInitialUrl();

    return () => {
      linkingListener.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isHandlingDeepLink) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Đang xử lý thanh toán...</Text>
      </View>
    );
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={{ user, roles }}>
        <PlayerProvider>
          <PlayerProviderV2>
            <LibraryProvider>
              <View style={{ flex: 1 }}>
                <NavigationContainer ref={navigationRef}>
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
                          component={DrawerNavigator}
                          options={{ headerShown: false }}
                        />
                      </>
                    )}
                    <Stack.Screen
                      name="Profile"
                      component={ProfileScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="DownLoad"
                      component={DownLoadScreen}
                      options={{headerShown: false}}
                    />
                    <Stack.Screen
                      name="EditProfile"
                      component={EditProfileScreen}
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
                      name="LikedSongsDownload"
                      component={LikedSongsDownload}
                      options={{headerShown: false}}
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
                      name="Payment" 
                      component={PaymentScreen} 
                      options={{headerShown: false}}
                    /> */}
                    <Stack.Screen
                      name="PaymentSuccess"
                      component={PaymentSuccess}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="PaymentFailure"
                      component={PaymentFailure}
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
