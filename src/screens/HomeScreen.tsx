import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AuthContext from '../contexts/AuthContext';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../services/api';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { user, roles } = useContext(AuthContext);
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/home');
                setData(response.data.message);
            } catch (error) {
                Alert.alert('Error', 'Failed to load data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await auth().signOut();
        } catch (error) {
            Alert.alert('Logout Error', 'Failed to sign out');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#4a90e2" />
            ) : (
                <Text style={styles.dataText}>{data}</Text>
            )}

            <View style={styles.buttonContainer}>
                {roles.includes('Admin') && (
                    <Button
                        title="Admin Dashboard"
                        onPress={() => navigation.navigate('Admin')}
                        color="#4a90e2"
                    />
                )}

                <Button
                    title="Logout"
                    onPress={handleLogout}
                    color="#ff3b30"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30,
    },
    dataText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        gap: 15,
    },
});

export default HomeScreen;