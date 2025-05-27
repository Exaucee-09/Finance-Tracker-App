import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import ApiService from '../services/apiService';

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

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const result = await ApiService.getAllExpenses();
            if (result.success) {
                setExpenses(result.data);
            } else {
                console.error('Failed to fetch expenses:', result.error);
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
            const result = await ApiService.createExpense(expense);
            if (result.success) {
                setExpenses(prevExpenses => [...prevExpenses, result.data]);
                await notificationService.showExpenseAddedNotification(expense.amount);
            } else {
                console.error('Failed to add expense:', result.error);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            const result = await ApiService.deleteExpense(id);
            if (result.success) {
                const expenseToDelete = expenses.find(exp => exp.id === id);
                setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== id));
                if (expenseToDelete) {
                    await notificationService.showExpenseDeletedNotification(expenseToDelete.amount);
                }
            } else {
                console.error('Failed to delete expense:', result.error);
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