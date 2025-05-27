import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExpenses } from '../context/ExpenseContext';

const CATEGORIES = [
    'Food',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Shopping',
    'Healthcare',
    'Education',
    'Other',
];

const AddExpenseScreen = () => {
    const navigation = useNavigation();
    const { addExpense } = useExpenses();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async () => {
        if (!amount || !description || !category) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        try {
            await addExpense({
                amount: numericAmount,
                description,
                category,
                date: new Date().toISOString(),
            });
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to add expense');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="decimal-pad"
                        placeholderTextColor="#95a5a6"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        placeholderTextColor="#95a5a6"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoryContainer}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryButton,
                                    category === cat && styles.categoryButtonSelected,
                                ]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text
                                    style={[
                                        styles.categoryButtonText,
                                        category === cat && styles.categoryButtonTextSelected,
                                    ]}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Add Expense</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    form: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
        color: '#2c3e50',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    categoryButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        margin: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryButtonSelected: {
        backgroundColor: '#27ae60',
        borderColor: '#27ae60',
    },
    categoryButtonText: {
        color: '#2c3e50',
        fontSize: 14,
    },
    categoryButtonTextSelected: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: '#27ae60',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddExpenseScreen; 