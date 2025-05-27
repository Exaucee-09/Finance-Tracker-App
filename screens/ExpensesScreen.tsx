// screens/ExpensesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useExpenses } from '../context/ExpenseContext';
import { Ionicons } from '@expo/vector-icons';
import { ExpensesStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<ExpensesStackParamList>;

interface Expense {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    createdAt: string;
}

const ExpensesScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { expenses, deleteExpense, fetchExpenses, loading } = useExpenses();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredExpenses(expenses);
        } else {
            const filtered = expenses.filter((expense: Expense) =>
                (expense.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (expense.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
            );
            setFilteredExpenses(filtered);
        }
    }, [expenses, searchQuery]);

    const handleAddExpense = () => {
        navigation.navigate('AddExpense');
    };

    const handleExpensePress = (expenseId: string) => {
        navigation.navigate('ExpenseDetail', { expenseId });
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => deleteExpense(id)
                }
            ]
        );
    };

    const renderExpenseItem = ({ item }: { item: Expense }) => (
        <TouchableOpacity
            style={styles.expenseItem}
            onPress={() => handleExpensePress(item.id)}
        >
            <View style={styles.expenseInfo}>
                <Text style={styles.expenseDescription}>{item.description}</Text>
                <Text style={styles.expenseCategory}>{item.category}</Text>
            </View>
            <View style={styles.expenseAmountContainer}>
                <Text style={styles.expenseAmount}>${Number(item.amount || 0).toFixed(2)}</Text>
                <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteButton}
                >
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#27ae60" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredExpenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchExpenses} />
                }
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No expenses found</Text>
                    </View>
                }
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddExpense}
            >
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 16,
        paddingHorizontal: 16,
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
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#2c3e50',
    },
    expenseItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    expenseInfo: {
        flex: 1,
    },
    expenseDescription: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2c3e50',
        marginBottom: 4,
    },
    expenseCategory: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    expenseAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#27ae60',
        marginRight: 12,
    },
    deleteButton: {
        padding: 8,
    },
    addButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#27ae60',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
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

export default ExpensesScreen; 