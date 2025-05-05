// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Button } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { navigationRef } from '../navigation/navigationRef';
// import { useFocusEffect } from '@react-navigation/native';

// const PaymentScreen = () => {
//     const [showWebView, setShowWebView] = useState(false);
//     const [paymentFailed, setPaymentFailed] = useState(false); 

//     const handleNavigationStateChange = (navState: any) => {
//         const url = navState.url;
//         if (url.includes('spotifyminiapp://payment-success')) {
//             navigationRef.current?.navigate('PaymentSuccess');
//         } else if (url.includes('spotifyminiapp://payment-failure')) {
//             setPaymentFailed(true);
//             navigationRef.current?.navigate('PaymentFailure');
//         }
//     };

//     useFocusEffect(
//         React.useCallback(() => {
//             if (!paymentFailed) {
//                 setShowWebView(false); // Nếu không có lỗi thanh toán, không hiển thị WebView
//             }

//             // Cleanup khi component không còn focus
//             return () => {};
//         }, [])
//     );

//     return (
//         <View style={styles.container}>
//             {!showWebView ? (
//                 <Button title="Open Payment Page" onPress={() => setShowWebView(true)} />
//             ) : (
//                 <WebView
//                     source={{ uri: 'http://10.0.2.2:5063/api/payment/start' }}
//                     onNavigationStateChange={handleNavigationStateChange}
//                 />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default PaymentScreen;

// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import api from '../services/api';
// import { navigationRef } from '../navigation/navigationRef';
// // import { NetworkInfo } from 'react-native-network-info';

// // const ip = await NetworkInfo.getIPV4Address(); // ví dụ: "192.168.1.10"
// const PaymentScreen = () => {
//     const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [showWebView, setShowWebView] = useState(false);
    
//     const handleNavigationStateChange = (navState: any) => {
//         const url = navState.url;
//         if (url.includes('spotifyminiapp://payment-success')) {
//             navigationRef.current?.navigate('PaymentSuccess');
//         } else if (url.includes('spotifyminiapp://payment-failure')) {
//             navigationRef.current?.navigate('PaymentFailure');
//         }
//     };

//     const startPayment = async () => {
//         setLoading(true);
//         try {
//             const response = await api.post('/payment', {
//                 planId: 1, // giả sử chọn gói premium có id = 1
//                 clientIp: 'http://10.0.2.2',
//             });

//             const url = response.data.paymentUrl;
//             console.log(url);
//             if (url) {
//                 setPaymentUrl(url);
//                 setShowWebView(true);
//             } else {
//                 Alert.alert('Lỗi', 'Không nhận được link thanh toán.');
//             }
//         } catch (error) {
//             console.error('Lỗi tạo link thanh toán:', error);
//             Alert.alert('Lỗi', 'Không thể tạo link thanh toán.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {loading && <ActivityIndicator size="large" />}
//             {!showWebView ? (
//                 <Button title="Thanh toán Premium" onPress={startPayment} />
//             ) : (
//                 paymentUrl && (
//                     <WebView
//                         source={{ uri: paymentUrl }}
//                         onNavigationStateChange={handleNavigationStateChange}
//                         startInLoadingState
//                     />
//                 )
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default PaymentScreen;

// PaymentScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Button, ActivityIndicator, Alert, Linking } from 'react-native';
import api from '../services/api';

const PaymentScreen = () => {
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payment', {
        planId: 1,
        clientIp: 'http://10.0.2.2', // máy ảo Android
      });

      const url = response.data.paymentUrl;
      if (url) {
        Linking.openURL(url); // mở VNPay bằng Chrome
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

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {!loading && <Button title="Thanh toán Premium" onPress={startPayment} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentScreen;
