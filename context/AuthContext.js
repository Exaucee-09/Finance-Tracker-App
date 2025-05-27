// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import ApiService from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return { ...state, loading: false, user: action.payload, isAuthenticated: true };
        case 'LOGIN_ERROR':
            return { ...state, loading: false, error: action.payload, isAuthenticated: false };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false, loading: false };
        case 'RESTORE_TOKEN':
            return { ...state, user: action.payload, isAuthenticated: true, loading: false };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
        loading: true,
        error: null,
    });

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const userData = await AsyncStorage.getItem('currentUser');

            if (token && userData) {
                dispatch({ type: 'RESTORE_TOKEN', payload: JSON.parse(userData) });
            } else {
                dispatch({ type: 'LOGOUT' });
            }
        } catch (error) {
            dispatch({ type: 'LOGOUT' });
        }
    };

    const login = async (username, password) => {
        dispatch({ type: 'LOGIN_START' });
        const result = await ApiService.login(username, password);

        if (result.success) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
        } else {
            dispatch({ type: 'LOGIN_ERROR', payload: result.error });
        }

        return result;
    };

    const logout = async () => {
        await ApiService.logout();
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
