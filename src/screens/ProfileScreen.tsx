// import React from 'react';
// import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import Ionicons  from 'react-native-vector-icons/Ionicons';
// import auth from '@react-native-firebase/auth';

// const playlists = [
//     { id: '1', title: 'Danh sách phát thứ 2 của tôi', saves: 0 },
//     { id: '2', title: 'Test', saves: 0 },
// ];

// export default function ProfileScreen() {
//     const navigation = useNavigation();
//     const userProfile = auth().currentUser;

//     const renderPlaylist = ({ item }: { item: typeof playlists[0] }) => (
//         <View style={styles.playlistItem}>
//             <View style={styles.musicIcon} />
//             <View style={styles.playlistInfo}>
//                 <Text style={styles.playlistTitle}>{item.title}</Text>
//                 <Text style={styles.playlistSaves}>{item.saves} lượt lưu</Text>
//             </View>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <LinearGradient
//                 colors={['#f5739f', '#121212']}
//                 style={styles.header}
//             >
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Text style={styles.backArrow}>←</Text>
//                     {/* <Ionicons name="arrow-back" size={30} color='gray'/> */}
//                 </TouchableOpacity>
//                 <View style={styles.avatarContainer}>
//                     <View style={styles.avatar}>
//                         <Text style={styles.avatarText}>T</Text>
//                         {/* <Image source={{uri: userProfile?.photoURL}}/> */}
//                     </View>
//                     <Text style={styles.username}>{userProfile?.displayName}</Text>
//                     <Text style={styles.followInfo}>0 người theo dõi - Đang theo dõi 4</Text>
//                     <TouchableOpacity style={styles.editButton}>
//                         <Text style={styles.editButtonText}>Chỉnh sửa</Text>
//                     </TouchableOpacity>
//                 </View>
//             </LinearGradient>

//             {/* Danh sách phát */}
//             <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Danh sách phát</Text>
//                 <FlatList
//                     data={playlists}
//                     renderItem={renderPlaylist}
//                     keyExtractor={(item) => item.id}
//                 />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#121212' },
//     header: { padding: 16, backgroundColor: '#a64ca6' },
//     backArrow: { color: '#fff', fontSize: 24 },
//     avatarContainer: { alignItems: 'center', marginTop: 8 },
//     avatar: {
//         backgroundColor: '#f77cae',
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     avatarText: { fontSize: 40, color: '#000', fontWeight: 'bold' },
//     username: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginTop: 8 },
//     followInfo: { color: '#ccc', marginTop: 4 },
//     editButton: {
//         marginTop: 8,
//         paddingHorizontal: 20,
//         paddingVertical: 6,
//         borderRadius: 20,
//         borderColor: '#fff',
//         borderWidth: 1,
//     },
//     editButtonText: { color: '#fff' },
//     section: { padding: 16 },
//     sectionTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold', marginBottom: 12 },
//     playlistItem: { flexDirection: 'row', marginBottom: 16 },
//     musicIcon: {
//         width: 50,
//         height: 50,
//         backgroundColor: '#555',
//         borderRadius: 4,
//         marginRight: 12,
//     },
//     playlistInfo: { justifyContent: 'center' },
//     playlistTitle: { color: '#fff', fontSize: 16 },
//     playlistSaves: { color: '#aaa', fontSize: 14 },
// });

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import api from '../services/api';

interface FollowInfoResponse {
    followerCount: number;
    followingCount: number;
    isFollowedByCurrentUser: boolean | null;
}

const playlists = [
    { id: '1', title: 'Danh sách phát thứ 2 của tôi', saves: 0 },
    { id: '2', title: 'Test', saves: 0 },
];

export default function ProfileScreen(props: any) {
    const userProfile = auth().currentUser;
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        const fetchFollowInfo = async () => {
            try {
                const userId = userProfile?.uid;
                if (!userId) return;

                const response = await api.get<FollowInfoResponse>(
                    `user/follow-info`
                );
                console.log("followinfo", response);
                setFollowersCount(response.data.followerCount);
                setFollowingCount(response.data.followingCount);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin follow:', error);
                setFollowersCount(0);
                setFollowingCount(0);
            }
        };

        fetchFollowInfo();
    }, [userProfile?.uid]);

    const renderPlaylist = ({ item }: { item: typeof playlists[0] }) => (
        <View style={styles.playlistItem}>
            <View style={styles.musicIcon} />
            <View style={styles.playlistInfo}>
                <Text style={styles.playlistTitle}>{item.title}</Text>
                <Text style={styles.playlistSaves}>{item.saves} lượt lưu</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#f5739f', '#121212']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Ionicons name="arrow-back" size={25} color="white" />
                </TouchableOpacity>

                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        {userProfile?.photoURL ? (
                            <Image
                                source={{ uri: userProfile.photoURL }}
                                style={{ width: 80, height: 80, borderRadius: 40 }}
                            />
                        ) : (
                            <Text style={styles.avatarText}>
                                {userProfile?.displayName?.charAt(0) ?? 'U'}
                            </Text>
                        )}
                    </View>

                    <Text style={styles.username}>{userProfile?.displayName}</Text>
                    <Text style={styles.followInfo}>
                        {followersCount} người theo dõi - Đang theo dõi {followingCount}
                    </Text>

                    <TouchableOpacity style={styles.editButton} onPress={() => props.navigation.navigate('EditProfile')}>
                        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Danh sách phát */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Danh sách phát</Text>
                <FlatList
                    data={playlists}
                    renderItem={renderPlaylist}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: { padding: 16, paddingTop: 48 },
    backArrow: { color: 'white', fontSize: 24 },
    avatarContainer: { alignItems: 'center', marginTop: 8 },
    avatar: {
        backgroundColor: '#f77cae',
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarText: { fontSize: 40, color: '#000', fontWeight: 'bold' },
    username: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 8,
    },
    followInfo: { color: '#ccc', marginTop: 4 },
    editButton: {
        marginTop: 8,
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
        borderColor: '#fff',
        borderWidth: 1,
    },
    editButtonText: { color: '#fff' },
    section: { padding: 16 },
    sectionTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    playlistItem: { flexDirection: 'row', marginBottom: 16 },
    musicIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#555',
        borderRadius: 4,
        marginRight: 12,
    },
    playlistInfo: { justifyContent: 'center' },
    playlistTitle: { color: '#fff', fontSize: 16 },
    playlistSaves: { color: '#aaa', fontSize: 14 },
});
