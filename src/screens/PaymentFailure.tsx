// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';

// type Props = NativeStackScreenProps<RootStackParamList, 'PaymentFailure'>;

// const PaymentFailure = ({ navigation, route }: Props) => {
//   const {
//     transactionId,
//     amount,
//     orderCode,
//     message,
//     paymentMethod,
//     orderDescription,
//     transactionDate,
//   } = route.params || {};

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>❌ Thanh toán thất bại!</Text>
//       <Text>Mã giao dịch: {transactionId}</Text>
//       <Text>Số tiền: {amount}</Text>
//       <Text>Đơn hàng: {orderCode}</Text>
//       <Text>Phương thức: {paymentMethod}</Text>
//       <Text>Mô tả: {orderDescription}</Text>
//       <Text>Ngày giao dịch: {transactionDate}</Text>
//       <Text>Thông báo: {message}</Text>

//       <Button title="Quay lại" onPress={() => navigation.goBack()} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, zIndex: 12 },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
// });

// export default PaymentFailure;
import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

//type Props = NativeStackScreenProps<RootStackParamList, 'PaymentFailure'>;

const PaymentFailure = ({ navigation, route }: any) => {
  const {
    transactionId,
    amount,
    orderCode,
    message,
    paymentMethod,
    orderDescription,
    transactionDate,
  } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="error-outline" size={64} color="#ff453a" />
        </View>

        <Text style={styles.title}>Thanh toán không thành công</Text>
        <Text style={styles.subtitle}>{message || 'Vui lòng thử lại hoặc chọn phương thức thanh toán khác'}</Text>

        <View style={styles.detailsCard}>
          <Text style={styles.detailHeading}>Chi tiết giao dịch</Text>

          <DetailRow label="Mã giao dịch:" value={transactionId} />
          <DetailRow label="Số tiền:" value={amount} />
          <DetailRow label="Phương thức:" value={paymentMethod} />
          <DetailRow label="Ngày giao dịch:" value={transactionDate} />
          <DetailRow label="Mô tả:" value={orderDescription} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Thử lại thanh toán</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('MainApp', {
          screen: 'Home',
          params: {
            screen: 'Home',
          },
        })}>
          <Text style={styles.secondaryButton}>Quay về trang chủ</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue} numberOfLines={1}>{value || '---'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#b3b3b3',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: '#282828',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  detailHeading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    color: '#b3b3b3',
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#1db954',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    color: '#1db954',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    padding: 12,
  },
});

export default PaymentFailure;