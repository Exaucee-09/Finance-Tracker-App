import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../context/ExpenseContext';

interface Expense {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    createdAt: string;
}

type RootStackParamList = {
    ExpenseDetail: { expenseId: string };
};

type ExpenseDetailRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;

const ExpenseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<ExpenseDetailRouteProp>();
    const { expenses, deleteExpense } = useExpenses();
    const { expenseId } = route.params;

    const expense = expenses.find((exp: Expense) => exp.id === expenseId);

    if (!expense) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Expense not found</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteExpense(expenseId);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Amount</Text>
                    <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.value}>{expense.description}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Category</Text>
                    <Text style={styles.value}>{expense.category}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>
                        {new Date(expense.date).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Created</Text>
                    <Text style={styles.value}>
                        {new Date(expense.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.deleteButtonText}>Delete Expense</Text>
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
    card: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    amountLabel: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 8,
    },
    amount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    detailRow: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#2c3e50',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 8,
        marginTop: 24,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
        marginTop: 24,
    },
});

export default ExpenseDetailScreen; 