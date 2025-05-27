import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    TextInput,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { MainTabParamList, ExpensesStackParamList } from '../navigation/AppNavigator';

type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
    NativeStackNavigationProp<ExpensesStackParamList>
>;

interface Expense {
    id: string;
    amount: number;
    description: string;
    category: string;
    date?: string;
    createdAt: string;
}

interface ExpenseStats {
    total: number;
    monthlyTotal: number;
    transactionCount: number;
    recentExpenses: Expense[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const DashboardScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { expenses, fetchExpenses, loading } = useExpenses();
    const { user } = useAuth();
    const { monthlyBudget, setMonthlyBudget, remainingBudget, spendingPercentage } = useBudget();
    const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
    const [newBudget, setNewBudget] = useState('');

    // Sample data for the chart (last 7 days)
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43, 50],
                color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
                strokeWidth: 2
            }
        ]
    };

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#27ae60'
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSetBudget = () => {
        setNewBudget(monthlyBudget.toString());
        setIsBudgetModalVisible(true);
    };

    const handleSaveBudget = () => {
        const amount = parseFloat(newBudget);
        if (!isNaN(amount) && amount >= 0) {
            setMonthlyBudget(amount);
            setIsBudgetModalVisible(false);
        } else {
            Alert.alert('Invalid Amount', 'Please enter a valid number.');
        }
    };

    const expenseStats = useMemo<ExpenseStats>(() => {
        const total = expenses.reduce((sum: number, expense: Expense) => sum + Number(expense.amount || 0), 0);
        const thisMonth = expenses.filter((expense: Expense) => {
            const expenseDate = new Date(expense.date || expense.createdAt);
            const now = new Date();
            return expenseDate.getMonth() === now.getMonth() &&
                expenseDate.getFullYear() === now.getFullYear();
        });
        const monthlyTotal = thisMonth.reduce((sum: number, expense: Expense) => sum + Number(expense.amount || 0), 0);

        return {
            total,
            monthlyTotal,
            transactionCount: expenses.length,
            recentExpenses: expenses.slice(0, 5),
        };
    }, [expenses]);

    return (
        <>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchExpenses} />
                }
            >
                <View style={styles.header}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.userName}>{user?.username || 'User'}</Text>
                    </View>
                    <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</Text>
                </View>

                <View style={styles.budgetContainer}>
                    <View style={styles.budgetHeader}>
                        <Text style={styles.budgetTitle}>Monthly Budget</Text>
                        <TouchableOpacity onPress={handleSetBudget} style={styles.editButton}>
                            <Ionicons name="pencil" size={20} color="#27ae60" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.budgetInfo}>
                        <Text style={styles.budgetAmount}>${monthlyBudget.toFixed(2)}</Text>
                        <Text style={styles.remainingText}>
                            Remaining: ${remainingBudget.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View 
                            style={[
                                styles.progressBar,
                                { 
                                    width: `${Math.min(spendingPercentage, 100)}%`,
                                    backgroundColor: spendingPercentage >= 100 ? '#e74c3c' : 
                                                  spendingPercentage >= 90 ? '#f39c12' : '#27ae60'
                                }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {spendingPercentage.toFixed(1)}% of budget used
                    </Text>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Weekly Spending</Text>
                    <LineChart
                        data={chartData}
                        width={CARD_WIDTH}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                    />
                </View>

                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: '#27ae60' }]}>
                        <Text style={styles.statValue}>${expenseStats.total.toFixed(2)}</Text>
                        <Text style={styles.statLabel}>Total Expenses</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#3498db' }]}>
                        <Text style={styles.statValue}>${expenseStats.monthlyTotal.toFixed(2)}</Text>
                        <Text style={styles.statLabel}>This Month</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#e67e22' }]}>
                        <Text style={styles.statValue}>{expenseStats.transactionCount}</Text>
                        <Text style={styles.statLabel}>Transactions</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Expenses</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ExpensesTab', { screen: 'ExpensesList' })}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {expenseStats.recentExpenses.map((expense) => (
                        <TouchableOpacity
                            key={expense.id}
                            style={styles.expenseItem}
                            onPress={() => navigation.navigate('ExpensesTab', {
                                screen: 'ExpenseDetail',
                                params: { expenseId: expense.id }
                            })}
                        >
                            <View style={styles.expenseInfo}>
                                <Text style={styles.expenseDescription}>{expense.description}</Text>
                                <Text style={styles.expenseCategory}>{expense.category}</Text>
                            </View>
                            <Text style={styles.expenseAmount}>${Number(expense.amount || 0).toFixed(2)}</Text>
                        </TouchableOpacity>
                    ))}
                    {expenseStats.recentExpenses.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No recent expenses</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('ExpensesTab', {
                        screen: 'AddExpense'
                    })}
                >
                    <Text style={styles.addButtonText}>+ Add New Expense</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={isBudgetModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsBudgetModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Set Monthly Budget</Text>
                        <TextInput
                            style={styles.budgetInput}
                            value={newBudget}
                            onChangeText={setNewBudget}
                            keyboardType="decimal-pad"
                            placeholder="Enter amount"
                            placeholderTextColor="#95a5a6"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsBudgetModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveBudget}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#27ae60',
        padding: 24,
        paddingTop: 50,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    welcomeContainer: {
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 20,
        color: '#fff',
        opacity: 0.9,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    dateText: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    budgetContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    budgetTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    editButton: {
        padding: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    budgetInfo: {
        marginBottom: 16,
    },
    budgetAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#27ae60',
        marginBottom: 8,
    },
    remainingText: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'right',
    },
    chartContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        marginTop: 8,
    },
    statCard: {
        width: (CARD_WIDTH - 32) / 3,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.9,
    },
    section: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    seeAllText: {
        fontSize: 14,
        color: '#27ae60',
        fontWeight: '600',
    },
    expenseItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseDescription: {
        fontSize: 16,
        color: '#2c3e50',
        marginBottom: 4,
        fontWeight: '500',
    },
    expenseCategory: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    expenseAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    addButton: {
        backgroundColor: '#27ae60',
        margin: 16,
        padding: 18,
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
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    budgetInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        color: '#2c3e50',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    saveButton: {
        backgroundColor: '#27ae60',
    },
    cancelButtonText: {
        color: '#2c3e50',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DashboardScreen; 