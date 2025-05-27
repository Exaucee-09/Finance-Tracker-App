import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    type: 'expense' | 'budget' | 'system';
}

const NotificationsScreen = () => {
    const [notifications, setNotifications] = React.useState<Notification[]>([
        {
            id: '1',
            title: 'Budget Alert',
            message: 'You have reached 80% of your monthly budget',
            timestamp: new Date().toISOString(),
            type: 'budget'
        },
        {
            id: '2',
            title: 'New Expense Added',
            message: 'Grocery shopping expense of $50.00 has been added',
            timestamp: new Date().toISOString(),
            type: 'expense'
        }
    ]);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'expense':
                return 'cash-outline';
            case 'budget':
                return 'wallet-outline';
            default:
                return 'notifications-outline';
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity style={styles.notificationItem}>
            <View style={styles.iconContainer}>
                <Ionicons 
                    name={getNotificationIcon(item.type)} 
                    size={24} 
                    color="#27ae60" 
                />
            </View>
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No notifications</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    notificationItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f9f4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        color: '#95a5a6',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#95a5a6',
        textAlign: 'center',
    },
});

export default NotificationsScreen; 