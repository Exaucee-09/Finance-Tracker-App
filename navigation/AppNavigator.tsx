// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import ProfileScreen from '../screens/ProfileScreen';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  AddExpense: undefined;
  ExpenseDetail: { expenseId: string };
  Profile: undefined;
};

type MainTabParamList = {
  Dashboard: undefined;
  Expenses: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Create a LogoutButton component
const LogoutButton: React.FC = () => {
    const { logout } = useAuth();
    return (
        <TouchableOpacity 
            onPress={logout}
            style={{ marginRight: 16 }}
        >
            <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
    );
};

const MainTabNavigator: React.FC = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Dashboard') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Expenses') {
                    iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#27ae60',
            tabBarInactiveTintColor: '#7f8c8d',
            tabBarStyle: {
                paddingBottom: 5,
                height: 60,
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#f0f0f0',
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
                marginBottom: 4,
            },
            headerStyle: {
                backgroundColor: '#fff',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
            },
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: '600',
                color: '#2c3e50',
            },
        })}
    >
        <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ 
                title: 'Home',
                headerTitle: 'Dashboard',
                headerRight: () => <LogoutButton />
            }}
        />
        <Tab.Screen
            name="Expenses"
            component={ExpensesScreen}
            options={{ 
                title: 'Expenses',
                headerTitle: 'All Expenses',
                headerRight: () => <LogoutButton />
            }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ 
                title: 'Profile',
                headerTitle: 'My Profile',
                headerRight: () => <LogoutButton />
            }}
        />
    </Tab.Navigator>
);

const AppNavigator: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            <Stack.Navigator 
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#fff',
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                    },
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#2c3e50',
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: '#27ae60',
                }}
            >
                {!isAuthenticated ? (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainTabNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="AddExpense"
                            component={AddExpenseScreen}
                            options={{ 
                                title: 'Add Expense',
                                headerRight: () => <LogoutButton />
                            }}
                        />
                        <Stack.Screen
                            name="ExpenseDetail"
                            component={ExpenseDetailScreen}
                            options={{ 
                                title: 'Expense Details',
                                headerRight: () => <LogoutButton />
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;