import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useExpenses } from '../context/ExpenseContext';

interface Expense {
    id: string;
    amount: number;
    description: string;
    category: string;
    date?: string;
    createdAt: string;
}

type RootStackParamList = {
    ExpenseDetail: { expenseId: string };
};

type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;

const ExpenseDetailScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<ExpenseDetailScreenRouteProp>();
    const { expenseId } = route.params;
    const [expense, setExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const { getExpenseById, deleteExpense } = useExpenses();

    useEffect(() => {
        loadExpenseDetail();
    }, [expenseId]);

    const loadExpenseDetail = async () => {
        setLoading(true);
        try {
            const result = await getExpenseById(expenseId);
            if (result.success) {
                setExpense(result.data);
            } else {
                Alert.alert('Error', 'Failed to load expense details');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: confirmDelete,
                },
            ]
        );
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            const result = await deleteExpense(expenseId);
            if (result.success) {
                Alert.alert('Success', 'Expense deleted successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', result.error || 'Failed to delete expense');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred while deleting');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#27ae60" />
                <Text style={styles.loadingText}>Loading expense details...</Text>
            </View>
        );
    }

    if (!expense) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Expense not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
                <Text style={styles.category}>{expense.category}</Text>
            </View>

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValue}>{expense.description}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>
                        {new Date(expense.date || expense.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Created</Text>
                    <Text style={styles.detailValue}>
                        {new Date(expense.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]} 
                    onPress={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.deleteButtonText}>Delete Expense</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#7f8c8d',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    errorText: {
        fontSize: 18,
        color: '#e74c3c',
        fontWeight: '600',
    },
    header: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    amount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#27ae60',
        marginBottom: 8,
    },
    category: {
        fontSize: 18,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    details: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    detailRow: {
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 4,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '500',
    },
    actions: {
        padding: 16,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    deleteButtonDisabled: {
        backgroundColor: '#bdc3c7',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ExpenseDetailScreen; 