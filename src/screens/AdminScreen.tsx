import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import AuthContext from '../contexts/AuthContext';
import api from '../services/api';
import auth from '@react-native-firebase/auth';

const AdminScreen = () => {
    const { roles, user } = useContext(AuthContext);
    const [adminData, setAdminData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    if (!roles.includes('Admin')) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Access Denied</Text>
            </View>
        );
    }

    useEffect(() => {
        // Fetch data from ASP.NET Core API
        const fetchAdminData = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                setAdminData(response.data);
            } catch (error) {
                console.error('API call error: ', error);
                Alert.alert('Error', 'Failed to load admin data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
    }, [user]);

    const handleLogout = async () => {
        try {
            await auth().signOut();
        } catch (error) {
            Alert.alert('Logout Error', 'Failed to sign out');
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            {adminData ?
                (
                    <>
                        <Text style={styles.content}>{JSON.stringify(adminData, null, 2)}</Text>
                        <Button
                            title="Logout"
                            onPress={handleLogout}
                            color="#ff3b30"
                        />
                    </>
                ) : (
                    <Text>No data available</Text>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        marginTop: 20,
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
});

export default AdminScreen;