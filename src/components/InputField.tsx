import React from 'react';
import { TextInput, Text, StyleSheet, TextInputProps } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType']; 
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }) => {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  input: {
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#777777',
    color: 'white',
  },
});

export default InputField;
