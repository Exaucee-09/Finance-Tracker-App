// services/validationService.js
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

export const validateExpense = (expense) => {
    const errors = {};

    if (!validateRequired(expense.amount)) {
        errors.amount = 'Amount is required';
    } else if (!validateAmount(expense.amount)) {
        errors.amount = 'Amount must be a positive number';
    }

    if (!validateRequired(expense.category)) {
        errors.category = 'Category is required';
    }

    if (!validateRequired(expense.description)) {
        errors.description = 'Description is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};