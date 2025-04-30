import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../services/api';

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const userProfile = auth().currentUser;

    const [name, setName] = useState(userProfile?.displayName);
    const [avatarUri, setAvatarUri] = useState<string | null>(userProfile?.photoURL ?? null);

    const handleChooseAvatar = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (result.assets && result.assets.length > 0) {
            setAvatarUri(result.assets[0].uri ?? null);
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('FullName', name);

            if (avatarUri) {
                formData.append('Avatar', {
                    uri: avatarUri,
                    type: 'image/jpeg',
                    name: 'avatar.jpg',
                } as any);
            }

            const response = await api.put('/user', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const updatedUser = response.data;

            await auth().currentUser?.updateProfile({
                displayName: updatedUser.fullName,
                photoURL: updatedUser.avatar,
            });

            Alert.alert('Thành công', 'Cập nhật hồ sơ thành công');
            navigation.goBack();
        } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveButton}>Lưu</Text>
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <TouchableOpacity onPress={handleChooseAvatar}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                    ) : userProfile?.photoURL ? (
                        <Image
                            source={{ uri: userProfile.photoURL }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={styles.avatarText}>
                                {userProfile?.displayName?.charAt(0) ?? 'U'}
                            </Text>
                        </View>
                    )}
                    <View style={styles.editIcon}>
                        <Icon name="edit" size={18} color="#000" />
                    </View>
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
        right: 0,
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
