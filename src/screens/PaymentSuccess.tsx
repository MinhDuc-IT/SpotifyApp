// import React from 'react';
// import { View, Text, Button } from 'react-native';

// const PaymentSuccess = ({ navigation }: any) => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Thanh toán thành công!</Text>
//     <Button
//       title="Quay lại"
//       onPress={() => navigation.goBack()}  // Quay lại màn hình trước đó
//     />
//   </View>
// );

// export default PaymentSuccess;
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

const PaymentSuccess = ({ navigation, route }: Props) => {
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
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Thanh toán thành công!</Text>
      <Text>Mã giao dịch: {transactionId}</Text>
      <Text>Số tiền: {amount}</Text>
      <Text>Đơn hàng: {orderCode}</Text>
      <Text>Phương thức: {paymentMethod}</Text>
      <Text>Mô tả: {orderDescription}</Text>
      <Text>Ngày giao dịch: {transactionDate}</Text>
      <Text>Thông báo: {message}</Text>

      <Button title="Quay lại" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});

export default PaymentSuccess;