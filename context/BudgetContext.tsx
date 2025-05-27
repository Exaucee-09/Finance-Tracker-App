import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/notificationService';
import { useExpenses } from './ExpenseContext';

interface BudgetContextType {
    monthlyBudget: number;
    setMonthlyBudget: (amount: number) => Promise<void>;
    remainingBudget: number;
    spendingPercentage: number;
    totalSpent: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const DEFAULT_BUDGET = 1000; // Default monthly budget

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [monthlyBudget, setMonthlyBudgetState] = useState(DEFAULT_BUDGET);
    const { expenses } = useExpenses();

    useEffect(() => {
        loadBudget();
    }, []);

    const loadBudget = async () => {
        try {
            const savedBudget = await AsyncStorage.getItem('monthlyBudget');
            if (savedBudget) {
                setMonthlyBudgetState(parseFloat(savedBudget));
            } else {
                // Set default budget if none exists
                await AsyncStorage.setItem('monthlyBudget', DEFAULT_BUDGET.toString());
                setMonthlyBudgetState(DEFAULT_BUDGET);
            }
        } catch (error) {
            console.error('Error loading budget:', error);
        }
    };

    const setMonthlyBudget = async (amount: number) => {
        try {
            await AsyncStorage.setItem('monthlyBudget', amount.toString());
            setMonthlyBudgetState(amount);
            await notificationService.showBudgetUpdatedNotification(amount);
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    // Calculate total spent for the current month
    const totalSpent = expenses.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date || expense.createdAt);
        const now = new Date();
        if (expenseDate.getMonth() === now.getMonth() && 
            expenseDate.getFullYear() === now.getFullYear()) {
            return sum + Number(expense.amount || 0);
        }
        return sum;
    }, 0);

    const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
    const spendingPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

    useEffect(() => {
        if (monthlyBudget > 0) {
            notificationService.scheduleBudgetAlert(spendingPercentage);
        }
    }, [spendingPercentage, monthlyBudget]);

    return (
        <BudgetContext.Provider
            value={{
                monthlyBudget,
                setMonthlyBudget,
                remainingBudget,
                spendingPercentage,
                totalSpent,
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
}; 