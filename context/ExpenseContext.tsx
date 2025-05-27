import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/notificationService';

interface Expense {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    createdAt: string;
}

interface ExpenseContextType {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    fetchExpenses: () => Promise<void>;
    loading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const SAMPLE_EXPENSES: Expense[] = [
    {
        id: '1',
        amount: 50.00,
        description: 'Grocery Shopping',
        category: 'Food',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        amount: 30.00,
        description: 'Movie Tickets',
        category: 'Entertainment',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        amount: 100.00,
        description: 'Electric Bill',
        category: 'Utilities',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '4',
        amount: 45.00,
        description: 'Restaurant Dinner',
        category: 'Food',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '5',
        amount: 80.00,
        description: 'Gas Station',
        category: 'Transportation',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '6',
        amount: 25.00,
        description: 'Coffee Shop',
        category: 'Food',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '7',
        amount: 60.00,
        description: 'Internet Bill',
        category: 'Utilities',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '8',
        amount: 40.00,
        description: 'Haircut',
        category: 'Personal Care',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    }
];

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const savedExpenses = await AsyncStorage.getItem('expenses');
            if (savedExpenses) {
                const parsedExpenses = JSON.parse(savedExpenses);
                setExpenses(parsedExpenses);
            } else {
                // Initialize with sample data if no expenses exist
                await AsyncStorage.setItem('expenses', JSON.stringify(SAMPLE_EXPENSES));
                setExpenses(SAMPLE_EXPENSES);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
        try {
            const newExpense: Expense = {
                ...expense,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };

            const updatedExpenses = [...expenses, newExpense];
            await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
            setExpenses(updatedExpenses);
            await notificationService.showExpenseAddedNotification(expense.amount);
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            const expenseToDelete = expenses.find(exp => exp.id === id);
            const updatedExpenses = expenses.filter(exp => exp.id !== id);
            await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
            setExpenses(updatedExpenses);
            if (expenseToDelete) {
                await notificationService.showExpenseDeletedNotification(expenseToDelete.amount);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                addExpense,
                deleteExpense,
                fetchExpenses,
                loading,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
}; 