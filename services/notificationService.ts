import { Alert, Platform } from 'react-native';

class NotificationService {
    async requestPermissions() {
        // For now, we'll just return true as we're using Alert
        return true;
    }

    async scheduleBudgetAlert(percentage: number) {
        if (percentage >= 90 && percentage < 100) {
            this.showAlert(
                'Budget Warning',
                `You've used ${percentage.toFixed(1)}% of your monthly budget.`
            );
        } else if (percentage >= 100) {
            this.showAlert(
                'Budget Exceeded',
                'You have exceeded your monthly budget!'
            );
        }
    }

    async showExpenseAddedNotification(amount: number) {
        this.showAlert(
            'Expense Added',
            `Successfully added expense of $${amount.toFixed(2)}`
        );
    }

    async showExpenseDeletedNotification(amount: number) {
        this.showAlert(
            'Expense Deleted',
            `Successfully deleted expense of $${amount.toFixed(2)}`
        );
    }

    async showBudgetUpdatedNotification(newBudget: number) {
        this.showAlert(
            'Budget Updated',
            `Your monthly budget has been set to $${newBudget.toFixed(2)}`
        );
    }

    private showAlert(title: string, message: string) {
        Alert.alert(title, message);
    }
}

export const notificationService = new NotificationService(); 