// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

// Types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type MainTabParamList = {
    Dashboard: undefined;
    ExpensesTab: {
        screen?: keyof ExpensesStackParamList;
        params?: {
            expenseId?: string;
        };
    };
    Notifications: undefined;
    Profile: undefined;
};

export type ExpensesStackParamList = {
    ExpensesList: undefined;
    AddExpense: undefined;
    ExpenseDetail: { expenseId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const ExpensesStack = createNativeStackNavigator<ExpensesStackParamList>();

const LogoutButton = () => {
    const { logout } = useAuth();
    return (
        <Ionicons
            name="log-out-outline"
            size={24}
            color="#e74c3c"
            onPress={logout}
            style={{ marginRight: 15 }}
        />
    );
};

const ExpensesStackNavigator = () => {
    return (
        <ExpensesStack.Navigator
            initialRouteName="ExpensesList"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#2c3e50',
                headerShadowVisible: false,
            }}
        >
            <ExpensesStack.Screen
                name="ExpensesList"
                component={ExpensesScreen}
                options={{
                    title: 'Expenses',
                    headerRight: () => <LogoutButton />,
                }}
            />
            <ExpensesStack.Screen
                name="AddExpense"
                component={AddExpenseScreen}
                options={{
                    title: 'Add Expense',
                    headerRight: () => <LogoutButton />,
                }}
            />
            <ExpensesStack.Screen
                name="ExpenseDetail"
                component={ExpenseDetailScreen}
                options={{
                    title: 'Expense Details',
                    headerRight: () => <LogoutButton />,
                }}
            />
        </ExpensesStack.Navigator>
    );
};

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'Dashboard':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'ExpensesTab':
                            iconName = focused ? 'list' : 'list-outline';
                            break;
                        case 'Notifications':
                            iconName = focused ? 'notifications' : 'notifications-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2c3e50',
                tabBarInactiveTintColor: '#95a5a6',
                headerStyle: {
                    backgroundColor: '#fff',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#2c3e50',
                headerRight: () => <LogoutButton />,
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Dashboard' }}
            />
            <Tab.Screen
                name="ExpensesTab"
                component={ExpensesStackNavigator}
                options={{ 
                    title: 'Expenses',
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'Notifications' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { isAuthenticated } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Auth" component={LoginScreen} />
                ) : (
                    <Stack.Screen name="Main" component={MainTabNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;