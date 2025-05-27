// services/apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: BASE_URL,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor for adding auth token
        this.api.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 429) {
                    // Rate limit exceeded
                    return Promise.reject(new Error('Too many requests. Please try again in a few moments.'));
                }
                if (error.response?.status === 404) {
                    return Promise.reject(new Error('Resource not found. Please try again.'));
                }
                console.error('API Error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    // Authentication methods
    async login(username, password) {
        try {
            const response = await this.api.get(`/users?username=${username}`);
            const users = response.data;

            if (users.length > 0) {
                const user = users[0];
                // In a real app, you'd verify password here
                await AsyncStorage.setItem('userToken', `token_${user.id}`);
                await AsyncStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true, user };
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.message || 'An error occurred during login. Please try again.' 
            };
        }
    }

    async logout() {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('currentUser');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Expense methods
    async createExpense(expenseData) {
        try {
            const sanitizedData = {
                ...expenseData,
                amount: Number(expenseData.amount) || 0,
                date: expenseData.date || new Date().toISOString(),
                category: expenseData.category || 'Uncategorized'
            };
            const response = await this.api.post('/expenses', sanitizedData);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.message || 'Failed to create expense. Please try again.' 
            };
        }
    }

    async getAllExpenses() {
        try {
            const response = await this.api.get('/expenses');
            const expenses = response.data.map(expense => ({
                ...expense,
                amount: Number(expense.amount) || 0,
                date: expense.date || new Date().toISOString(),
                category: expense.category || 'Uncategorized'
            }));
            return { success: true, data: expenses };
        } catch (error) {
            return { 
                success: false, 
                error: error.message || 'Failed to fetch expenses. Please try again.' 
            };
        }
    }

    async getExpenseById(id) {
        try {
            const response = await this.api.get(`/expenses/${id}`);
            const expense = {
                ...response.data,
                amount: Number(response.data.amount) || 0,
                date: response.data.date || new Date().toISOString(),
                category: response.data.category || 'Uncategorized'
            };
            return { success: true, data: expense };
        } catch (error) {
            return { 
                success: false, 
                error: error.message || 'Failed to fetch expense details. Please try again.' 
            };
        }
    }

    async deleteExpense(id) {
        try {
            await this.api.delete(`/expenses/${id}`);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.message || 'Failed to delete expense. Please try again.' 
            };
        }
    }
}

export default new ApiService();