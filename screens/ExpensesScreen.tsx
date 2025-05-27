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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useExpenses } from '../context/ExpenseContext';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    Expenses: undefined;
    ExpenseDetail: { expenseId: string };
    AddExpense: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Expenses'>;

interface Expense {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
}

const ExpensesScreen: React.FC = () => {
    const { expenses, loading, error, deleteExpense } = useExpenses();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        if (expenses) {
            const transformedExpenses = expenses.map((expense: any) => ({
                ...expense,
                amount: typeof expense.amount === 'number' ? expense.amount : Number(expense.amount) || 0,
                date: expense.date || new Date().toISOString(),
                category: expense.category || 'Uncategorized'
            }));
            
            const filtered = transformedExpenses.filter((expense: Expense) => 
                (expense.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (expense.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
            );
            setFilteredExpenses(filtered);
        }
    }, [expenses, searchQuery]);

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
            onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })}
        >
            <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseCategory}>{item.category}</Text>
                <Text style={styles.expenseDate}>
                    {new Date(item.date).toLocaleDateString()}
                </Text>
            </View>
            <View style={styles.expenseAmountContainer}>
                <Text style={styles.expenseAmount}>
                    ${Number(item.amount || 0).toFixed(2)}
                </Text>
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
            <View style={styles.centered}>
                <Text>Loading expenses...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
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
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No expenses found</Text>
                    </View>
                }
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddExpense')}
            >
                <Ionicons name="add" size={30} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 16,
        paddingHorizontal: 16,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    listContainer: {
        padding: 16,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    expenseCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    expenseDate: {
        fontSize: 12,
        color: '#999',
    },
    expenseAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27ae60',
        marginRight: 12,
    },
    deleteButton: {
        padding: 8,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#27ae60',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#27ae60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default ExpensesScreen; 