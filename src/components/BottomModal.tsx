// BottomModal.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const BottomModal: React.FC<BottomModalProps> = ({ visible, onClose, children }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.modalContent}>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
  },
});