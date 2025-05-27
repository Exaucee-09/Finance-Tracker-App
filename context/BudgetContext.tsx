import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useExpenses } from './ExpenseContext';

interface BudgetContextType {
    monthlyBudget: number;
    setMonthlyBudget: (amount: number) => void;
    remainingBudget: number;
    spendingPercentage: number;
    checkBudgetStatus: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
    const { expenses } = useExpenses();
    const [remainingBudget, setRemainingBudget] = useState<number>(0);
    const [spendingPercentage, setSpendingPercentage] = useState<number>(0);

    useEffect(() => {
        calculateBudgetStatus();
    }, [expenses, monthlyBudget]);

    const calculateBudgetStatus = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date || expense.createdAt);
            return expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
        });

        const totalSpent = monthlyExpenses.reduce((sum, expense) => 
            sum + Number(expense.amount || 0), 0);

        const remaining = monthlyBudget - totalSpent;
        const percentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

        setRemainingBudget(remaining);
        setSpendingPercentage(percentage);

        // Check budget status and show notifications
        if (percentage >= 90 && percentage < 100) {
            Alert.alert(
                'Budget Warning',
                'You have used 90% of your monthly budget!'
            );
        } else if (percentage >= 100) {
            Alert.alert(
                'Budget Alert',
                'You have exceeded your monthly budget!'
            );
        }
    };

    const checkBudgetStatus = () => {
        calculateBudgetStatus();
    };

    return (
        <BudgetContext.Provider value={{
            monthlyBudget,
            setMonthlyBudget,
            remainingBudget,
            spendingPercentage,
            checkBudgetStatus
        }}>
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