import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';

export default function EditProfileScreen() {
  const navigation = useNavigation();  
  const userProfile = auth().currentUser;

  const [name, setName] = useState(userProfile?.displayName);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity onPress={() => console.log('Save', name)}>
          <Text style={styles.saveButton}>Lưu</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>T</Text>
        </View>
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="edit" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Name Field */}
      <View style={styles.field}>
        <Text style={styles.label}>Tên</Text>
        <TextInput
          value={name ?? ""}
          onChangeText={setName}
          style={styles.input}
          placeholder="Nhập tên"
          placeholderTextColor="#aaa"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  closeButton: { color: '#fff', fontSize: 24 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  saveButton: { color: '#ccc', fontSize: 16 },

  avatarWrapper: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f77cae',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 48, fontWeight: 'bold', color: '#000' },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },

  field: {
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 8,
  },
  label: { color: '#fff', fontWeight: 'bold', marginBottom: 4 },
  input: {
    color: '#fff',
    fontSize: 16,
  },
});
