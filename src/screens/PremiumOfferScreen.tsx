// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Linking,
//   ImageBackground,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import api from '../services/api';

// const PremiumOfferScreen = () => {
//   const [loading, setLoading] = useState(false);
//   const [subsciptionType, setSubscriptionType] = useState<string>("Free");

//   useEffect(() => {
//     const checkSubscription = async () => {
//       try {
//         const response = await api.get('check-subscription');
//         setSubscriptionType(response.data.subscriptionType);
//       } catch(ex) {
//         console.log(ex);
//       }
//     }
//   }, [])
  
//   const startPayment = async () => {
//     setLoading(true);
//     try {
//       const response = await api.post('/payment', {
//         planId: 1,
//         clientIp: 'http://10.0.2.2', // Android emulator
//       });

//       const url = response.data.paymentUrl;
//       if (url) {
//         Linking.openURL(url); // open VNPay link
//       } else {
//         Alert.alert('Lỗi', 'Không nhận được link thanh toán.');
//       }
//     } catch (error) {
//       console.error('Lỗi tạo link thanh toán:', error);
//       Alert.alert('Lỗi', 'Không thể tạo link thanh toán.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <ImageBackground
//         source={{ uri: 'https://res.cloudinary.com/dswyuiiqp/image/upload/v1746454880/spotify_yxv7g1.jpg' }}
//         style={styles.header}
//         resizeMode="cover"
//       >
//         <Text style={styles.title}>
//           Nhận 4 tháng dùng gói Premium với giá 59.000 ₫ trên Spotify
//         </Text>
//         <TouchableOpacity style={styles.badge}>
//           <Ionicons name="notifications-outline" size={16} color="#fff" />
//           <Text style={styles.badgeText}> Ưu đãi có hạn</Text>
//         </TouchableOpacity>
//       </ImageBackground>

//       <TouchableOpacity style={styles.button} onPress={startPayment} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator size="small" color="#000" />
//         ) : (
//           <Text style={styles.buttonText}>Dùng thử 4 tháng với giá 100.000 ₫</Text>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.description}>
//         100.000 ₫ cho 4 tháng, sau đó là 100.000 ₫/tháng. Chỉ áp dụng ưu đãi nếu bạn đăng ký qua Spotify
//         và chưa từng dùng gói Premium. Các ưu đãi qua Google Play có thể khác. Ưu đãi kết thúc vào ngày
//         19 tháng 5, 2025.
//       </Text>

//       <View style={styles.reasonSection}>
//         <Text style={styles.reasonTitle}>Lý do nên dùng gói Premium</Text>
//         {features.map((item, index) => (
//           <View key={index} style={styles.featureItem}>
//             {item.icon}
//             <Text style={styles.featureText}>{item.text}</Text>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const features = [
//   {
//     icon: <MaterialIcons name="block" size={20} color="#fff" />,
//     text: 'Nghe nhạc không quảng cáo',
//   },
//   {
//     icon: <MaterialIcons name="file-download" size={20} color="#fff" />,
//     text: 'Tải xuống để nghe không cần mạng',
//   },
//   {
//     icon: <MaterialIcons name="shuffle" size={20} color="#fff" />,
//     text: 'Phát nhạc theo thứ tự bất kỳ',
//   },
//   {
//     icon: <Ionicons name="headset" size={20} color="#fff" />,
//     text: 'Chất lượng âm thanh cao',
//   },
//   {
//     icon: <FontAwesome5 name="user-friends" size={20} color="#fff" />,
//     text: 'Nghe cùng bạn bè theo thời gian thực',
//   },
//   {
//     icon: <MaterialIcons name="playlist-play" size={20} color="#fff" />,
//     text: 'Sắp xếp danh sách chờ nghe',
//   },
// ];

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0b0b0b',
//     padding: 16,
//   },
//   header: {
//     marginBottom: 16,
//     paddingTop: 150,
//   },
//   title: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 12,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   button: {
//     backgroundColor: '#fff',
//     paddingVertical: 14,
//     borderRadius: 24,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   buttonText: {
//     color: '#000',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   description: {
//     color: '#aaa',
//     fontSize: 14,
//     marginBottom: 24,
//   },
//   reasonSection: {
//     backgroundColor: '#1c1c1e',
//     borderRadius: 16,
//     padding: 16,
//   },
//   reasonTitle: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginBottom: 16,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   featureText: {
//     color: '#fff',
//     marginLeft: 12,
//     fontSize: 15,
//   },
// });

// export default PremiumOfferScreen;

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Linking,
//   ImageBackground,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import api from '../services/api';
// import { useFocusEffect } from '@react-navigation/native';

// const PremiumOfferScreen = () => {
//   const [loading, setLoading] = useState(false);
//   const [checkingSub, setCheckingSub] = useState(true);
//   const [subscriptionType, setSubscriptionType] = useState<string>('Free');

//   useEffect(() => {
//     const checkSubscription = async () => {
//       try {
//         setCheckingSub(true);
//         const response = await api.get('/user/check-subscription');
//         console.log(response);
//         setSubscriptionType(response.data.subscriptionType);
//       } catch (ex) {
//         console.log(ex);
//       } finally {
//         setCheckingSub(false);
//       }
//     };

//     checkSubscription();
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       const checkSubscription = async () => {
//         try {
//           setCheckingSub(true);
//           const response = await api.get('/user/check-subscription');
//           console.log(response);
//           setSubscriptionType(response.data.subscriptionType);
//         } catch (ex) {
//           console.log(ex);
//         } finally {
//           setCheckingSub(false);
//         }
//       };
  
//       checkSubscription();
//     }, [])
//   );
  
//   const startPayment = async () => {
//     setLoading(true);
//     try {
//       const response = await api.post('/payment', {
//         planId: 1,
//         clientIp: 'http://10.0.2.2',
//       });

//       const url = response.data.paymentUrl;
//       if (url) {
//         Linking.openURL(url);
//       } else {
//         Alert.alert('Lỗi', 'Không nhận được link thanh toán.');
//       }
//     } catch (error) {
//       console.error('Lỗi tạo link thanh toán:', error);
//       Alert.alert('Lỗi', 'Không thể tạo link thanh toán.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <ImageBackground
//         source={{
//           uri: 'https://res.cloudinary.com/dswyuiiqp/image/upload/v1746454880/spotify_yxv7g1.jpg',
//         }}
//         style={styles.header}
//         resizeMode="cover"
//       >
//         <Text style={styles.title}>
//           Nhận 4 tháng dùng gói Premium với giá 59.000 ₫ trên Spotify
//         </Text>
//         <TouchableOpacity style={styles.badge}>
//           <Ionicons name="notifications-outline" size={16} color="#fff" />
//           <Text style={styles.badgeText}> Ưu đãi có hạn</Text>
//         </TouchableOpacity>
//       </ImageBackground>

//       {checkingSub ? (
//         <ActivityIndicator color="#fff" size="small" style={{ marginVertical: 20 }} />
//       ) : subscriptionType === 'Free' ? (
//         <TouchableOpacity
//           style={styles.button}
//           onPress={startPayment}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : (
//             <Text style={styles.buttonText}>Dùng thử 4 tháng với giá 100.000 ₫</Text>
//           )}
//         </TouchableOpacity>
//       ) : (
//         <View style={styles.premiumNotice}>
//           <Ionicons name="checkmark-circle-outline" size={20} color="#1db954" />
//           <Text style={styles.premiumText}>Bạn đang sử dụng gói Premium</Text>
//         </View>
//       )}

//       <Text style={styles.description}>
//         100.000 ₫ cho 4 tháng, sau đó là 100.000 ₫/tháng. Chỉ áp dụng ưu đãi nếu bạn đăng ký qua Spotify
//         và chưa từng dùng gói Premium. Các ưu đãi qua Google Play có thể khác. Ưu đãi kết thúc vào ngày
//         19 tháng 5, 2025.
//       </Text>

//       <View style={styles.reasonSection}>
//         <Text style={styles.reasonTitle}>Lý do nên dùng gói Premium</Text>
//         {features.map((item, index) => (
//           <View key={index} style={styles.featureItem}>
//             {item.icon}
//             <Text style={styles.featureText}>{item.text}</Text>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const features = [
//   {
//     icon: <MaterialIcons name="block" size={20} color="#fff" />,
//     text: 'Nghe nhạc không quảng cáo',
//   },
//   {
//     icon: <MaterialIcons name="file-download" size={20} color="#fff" />,
//     text: 'Tải xuống để nghe không cần mạng',
//   },
//   {
//     icon: <MaterialIcons name="shuffle" size={20} color="#fff" />,
//     text: 'Phát nhạc theo thứ tự bất kỳ',
//   },
//   {
//     icon: <Ionicons name="headset" size={20} color="#fff" />,
//     text: 'Chất lượng âm thanh cao',
//   },
//   {
//     icon: <FontAwesome5 name="user-friends" size={20} color="#fff" />,
//     text: 'Nghe cùng bạn bè theo thời gian thực',
//   },
//   {
//     icon: <MaterialIcons name="playlist-play" size={20} color="#fff" />,
//     text: 'Sắp xếp danh sách chờ nghe',
//   },
// ];

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0b0b0b',
//     padding: 16,
//   },
//   header: {
//     marginBottom: 16,
//     paddingTop: 150,
//   },
//   title: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 12,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   button: {
//     backgroundColor: '#fff',
//     paddingVertical: 14,
//     borderRadius: 24,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   buttonText: {
//     color: '#000',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   description: {
//     color: '#aaa',
//     fontSize: 14,
//     marginBottom: 24,
//   },
//   reasonSection: {
//     backgroundColor: '#1c1c1e',
//     borderRadius: 16,
//     padding: 16,
//   },
//   reasonTitle: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginBottom: 16,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   featureText: {
//     color: '#fff',
//     marginLeft: 12,
//     fontSize: 15,
//   },
//   premiumNotice: {
//     backgroundColor: '#1db95420',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   premiumText: {
//     color: '#1db954',
//     fontSize: 15,
//     marginLeft: 8,
//     fontWeight: '500',
//   },  
// });

// export default PremiumOfferScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

interface UserSubscriptionDto {
  subscriptionType: 'Free' | 'Premium';
  premiumExpiryDate: string | null; // ISO date string or null
}

const PremiumOfferScreen = () => {
  const [loading, setLoading] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<string>("Free");
  const [premiumExpiryDate, setPremiumExpiryDate] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await api.get('/user/check-subscription');
        console.log('subscriptionType', response.data);
        setSubscriptionType(response.data.subscriptionType);
        setPremiumExpiryDate(response.data.premiumExpiryDate);
      } catch(ex) {
        console.log(ex);
      }
    }
    checkSubscription();
  }, []);
  
  useFocusEffect(
    React.useCallback(() => {
      const checkSubscription = async () => {
        try {
          const response = await api.get('/user/check-subscription');
          setSubscriptionType(response.data.subscriptionType);
          setPremiumExpiryDate(response.data.premiumExpiryDate);
        } catch (ex) {
          console.log(ex);
        } finally {
        }
      };
  
      checkSubscription();
    }, [])
  );
  
  const isPremium = subscriptionType === "Premium";

  const startPayment = async () => {
    if (isPremium) return;
    
    setLoading(true);
    try {
      const response = await api.post('/payment', {
        planId: 1,
        clientIp: 'http://10.0.2.2',
      });

      const url = response.data.paymentUrl;
      if (url) {
        Linking.openURL(url);
      } else {
        Alert.alert('Lỗi', 'Không nhận được link thanh toán.');
      }
    } catch (error) {
      console.error('Lỗi tạo link thanh toán:', error);
      Alert.alert('Lỗi', 'Không thể tạo link thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  const getHeaderText = () => {
    return isPremium 
      ? "Chào mừng trở lại với Premium" 
      : "Nhận 4 tháng dùng gói Premium với giá 100.000 ₫";
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://res.cloudinary.com/dswyuiiqp/image/upload/v1746454880/spotify_yxv7g1.jpg' }}
        style={styles.header}
        resizeMode="cover"
      >
        <Text style={styles.title}>{getHeaderText()}</Text>
        
        {!isPremium && (
          <TouchableOpacity style={styles.badge}>
            <Ionicons name="notifications-outline" size={16} color="#fff" />
            <Text style={styles.badgeText}> Ưu đãi có hạn</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>

      {!isPremium ? (
        <TouchableOpacity 
          style={styles.button} 
          onPress={startPayment} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              Dùng thử 4 tháng với giá 100.000 ₫
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.premiumBadge}>
          <MaterialIcons name="verified" size={24} color="#1db954" />
          <Text style={styles.premiumBadgeText}>GÓI PREMIUM CỦA BẠN</Text>
        </View>
      )}

      <Text style={styles.description}>
        {isPremium 
          ? `Gói Premium của bạn sẽ gia hạn vào ngày ${premiumExpiryDate ? new Date(premiumExpiryDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
           : 'không xác định'}`
          : '100.000 ₫ cho 4 tháng, sau đó là 100.000 ₫/tháng. Ưu đãi kết thúc vào ngày 19 tháng 5, 2025.'}
      </Text>

      <View style={styles.reasonSection}>
        <Text style={styles.reasonTitle}>
          {isPremium ? 'Quyền lợi của bạn' : 'Lý do nên dùng gói Premium'}
        </Text>
        
        {features.map((item, index) => (
          <View key={index} style={styles.featureItem}>
            {isPremium ? (
              <MaterialIcons name="check-circle" size={20} color="#1db954" />
            ) : (
              item.icon
            )}
            <Text style={[
              styles.featureText,
              isPremium && styles.premiumFeature
            ]}>{item.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const features = [
  {
    icon: <MaterialIcons name="block" size={20} color="#fff" />,
    text: 'Nghe nhạc không quảng cáo',
  },
  {
    icon: <MaterialIcons name="file-download" size={20} color="#fff" />,
    text: 'Tải xuống để nghe không cần mạng',
  },
  {
    icon: <MaterialIcons name="shuffle" size={20} color="#fff" />,
    text: 'Phát nhạc theo thứ tự bất kỳ',
  },
  {
    icon: <Ionicons name="headset" size={20} color="#fff" />,
    text: 'Chất lượng âm thanh cao',
  },
  {
    icon: <FontAwesome5 name="user-friends" size={20} color="#fff" />,
    text: 'Nghe cùng bạn bè theo thời gian thực',
  },
  {
    icon: <MaterialIcons name="playlist-play" size={20} color="#fff" />,
    text: 'Sắp xếp danh sách chờ nghe',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    padding: 16,
  },
  header: {
    marginBottom: 16,
    paddingTop: 150,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    maxWidth: '90%',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 24,
  },
  reasonSection: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 16,
  },
  reasonTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 15,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1db95420',
    padding: 12,
    borderRadius: 24,
    marginBottom: 16,
  },
  premiumBadgeText: {
    color: '#1db954',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  premiumFeature: {
    color: '#1db954',
  },
  manageButton: {
    borderWidth: 1,
    borderColor: '#535353',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  manageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PremiumOfferScreen;