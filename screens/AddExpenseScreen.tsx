import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useExpenses } from '../context/ExpenseContext';
import { validateExpense } from '../services/validationService';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Other'
] as const;

type Category = typeof CATEGORIES[number];

interface FormData {
    amount: string;
    category: Category;
    description: string;
    date: string;
}

interface FormErrors {
    amount?: string;
    category?: string;
    description?: string;
    date?: string;
}

const AddExpenseScreen: React.FC = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState<FormData>({
        amount: '',
        category: CATEGORIES[0],
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const { createExpense } = useExpenses();

    const handleSubmit = async () => {
        const validation = validateExpense(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        const result = await createExpense({
            ...formData,
            amount: parseFloat(formData.amount),
            createdAt: new Date().toISOString(),
        });

        setLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Expense added successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', result.error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Add New Expense</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount ($)</Text>
                    <TextInput
                        style={[styles.input, errors.amount && styles.inputError]}
                        value={formData.amount}
                        onChangeText={(text) => setFormData({ ...formData, amount: text })}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                    />
                    {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                            style={styles.picker}
                        >
                            {CATEGORIES.map((category) => (
                                <Picker.Item key={category} label={category} value={category} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Enter expense description"
                        multiline
                        numberOfLines={3}
                    />
                    {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                                <Text style={styles.submitButtonText}>Save Expense</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
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
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 24,
    },
    inputContainer: {
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
        borderWidth: 1,
        borderColor: '#e1e8ed',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: '#e74c3c',
        backgroundColor: '#fdf2f2',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 6,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e1e8ed',
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    cancelButton: {
        flex: 1,
        marginRight: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#2c3e50',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#27ae60',
        flex: 1,
        marginLeft: 12,
        shadowColor: '#27ae60',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default AddExpenseScreen; 