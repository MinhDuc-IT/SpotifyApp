// ModalContent.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ModalContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const ModalContent: React.FC<ModalContentProps> = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
});
