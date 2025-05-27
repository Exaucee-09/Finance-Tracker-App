import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC = () => {
    const { user } = useAuth();

    const handleExportData = () => {
        // TODO: Implement data export functionality
        Alert.alert('Coming Soon', 'Data export feature will be available soon!');
    };

    const handleChangePassword = () => {
        // TODO: Implement password change functionality
        Alert.alert('Coming Soon', 'Password change feature will be available soon!');
    };

    const handleNotificationSettings = () => {
        // TODO: Implement notification settings
        Alert.alert('Coming Soon', 'Notification settings will be available soon!');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={100} color="#27ae60" />
                </View>
                <Text style={styles.username}>{user?.username || 'User'}</Text>
                <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Settings</Text>
                
                <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
                    <Ionicons name="lock-closed-outline" size={24} color="#666" />
                    <Text style={styles.menuItemText}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleNotificationSettings}>
                    <Ionicons name="notifications-outline" size={24} color="#666" />
                    <Text style={styles.menuItemText}>Notification Settings</Text>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleExportData}>
                    <Ionicons name="download-outline" size={24} color="#666" />
                    <Text style={styles.menuItemText}>Export Data</Text>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Information</Text>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Version</Text>
                    <Text style={styles.infoValue}>1.0.0</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Last Updated</Text>
                    <Text style={styles.infoValue}>March 2024</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 20,
        padding: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
        marginLeft: 12,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#2c3e50',
    },
    infoValue: {
        fontSize: 16,
        color: '#7f8c8d',
    },
});

export default ProfileScreen; 