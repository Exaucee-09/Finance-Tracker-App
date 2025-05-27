// context/ExpenseContext.js
import React, { createContext, useContext, useReducer } from 'react';
import ApiService from '../services/apiService';

const ExpenseContext = createContext();

const expenseReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { 
                ...state, 
                loading: false, 
                expenses: action.payload.map(expense => ({
                    ...expense,
                    amount: Number(expense.amount) || 0
                }))
            };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'ADD_EXPENSE':
            return { ...state, expenses: [action.payload, ...state.expenses] };
        case 'DELETE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.filter(expense => expense.id !== action.payload)
            };
        default:
            return state;
    }
};

export const ExpenseProvider = ({ children }) => {
    const [state, dispatch] = useReducer(expenseReducer, {
        expenses: [],
        loading: false,
        error: null,
    });

    const fetchExpenses = async () => {
        dispatch({ type: 'FETCH_START' });
        const result = await ApiService.getAllExpenses();

        if (result.success) {
            dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        } else {
            dispatch({ type: 'FETCH_ERROR', payload: result.error });
        }
    };

    const createExpense = async (expenseData) => {
        const result = await ApiService.createExpense(expenseData);

        if (result.success) {
            dispatch({ type: 'ADD_EXPENSE', payload: result.data });
            return result;
        }

        return result;
    };

    const deleteExpense = async (id) => {
        const result = await ApiService.deleteExpense(id);

        if (result.success) {
            dispatch({ type: 'DELETE_EXPENSE', payload: id });
        }

        return result;
    };

    const getExpenseById = async (id) => {
        return await ApiService.getExpenseById(id);
    };

    return (
        <ExpenseContext.Provider value={{
            ...state,
            fetchExpenses,
            createExpense,
            deleteExpense,
            getExpenseById,
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenses must be used within ExpenseProvider');
    }
    return context;
};