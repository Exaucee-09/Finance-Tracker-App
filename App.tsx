// App.tsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { BudgetProvider } from './context/BudgetContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BudgetProvider>
          <AppNavigator />
        </BudgetProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}
