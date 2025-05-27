interface ValidationResult {
    isValid: boolean;
    errors: {
        [key: string]: string;
    };
}

export const validateExpense = (data: {
    amount: string;
    category: string;
    description: string;
    date: string;
}): ValidationResult => {
    const errors: { [key: string]: string } = {};

    // Amount validation
    if (!data.amount) {
        errors.amount = 'Amount is required';
    } else {
        const amount = parseFloat(data.amount);
        if (isNaN(amount)) {
            errors.amount = 'Please enter a valid number';
        } else if (amount <= 0) {
            errors.amount = 'Amount must be greater than 0';
        } else if (amount > 1000000) {
            errors.amount = 'Amount cannot exceed $1,000,000';
        }
    }

    // Category validation
    if (!data.category) {
        errors.category = 'Category is required';
    }

    // Description validation
    if (!data.description) {
        errors.description = 'Description is required';
    } else if (data.description.length < 3) {
        errors.description = 'Description must be at least 3 characters long';
    } else if (data.description.length > 200) {
        errors.description = 'Description cannot exceed 200 characters';
    }

    // Date validation
    if (!data.date) {
        errors.date = 'Date is required';
    } else {
        const date = new Date(data.date);
        if (isNaN(date.getTime())) {
            errors.date = 'Please enter a valid date';
        } else if (date > new Date()) {
            errors.date = 'Date cannot be in the future';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateLogin = (username: string, password: string): ValidationResult => {
    const errors: { [key: string]: string } = {};

    if (!username) {
        errors.username = 'Username is required';
    } else if (username.length < 3) {
        errors.username = 'Username must be at least 3 characters long';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}; 