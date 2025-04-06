// components/ActionButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ActionButtonProps {
    isLoading: boolean;
    onPress: (event: GestureResponderEvent) => void;
    label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ isLoading, onPress, label }) => {
    return (
        <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={onPress}
            disabled={isLoading}
        >
            <Text style={styles.buttonText}>
                {isLoading ? 'Processing...' : label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#999',
        borderColor: '#999',
    },
});

export default ActionButton;
