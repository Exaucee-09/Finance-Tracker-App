// screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
    Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { validateLogin } from '../services/validationService';

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { login } = useAuth();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        const validation = validateLogin(username, password);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const result = await login(username, password);
            if (!result.success) {
                setErrors({ general: result.error || 'Login failed. Please try again.' });
            }
        } catch (err) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <View style={styles.logoContainer}>
                    <Ionicons name="wallet" size={80} color="#27ae60" />
                    <Text style={styles.appName}>Finance Tracker</Text>
                    <Text style={styles.tagline}>Track your expenses with ease</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={[styles.inputContainer, errors.username && styles.inputError]}>
                        <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (errors.username) {
                                    setErrors({ ...errors, username: '' });
                                }
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                    {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                    <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                        <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) {
                                    setErrors({ ...errors, password: '' });
                                }
                            }}
                            secureTextEntry
                        />
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    {errors.general && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color="#e74c3c" />
                            <Text style={styles.errorText}>{errors.general}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.loginButtonText}>Login</Text>
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 16,
    },
    tagline: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 8,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fde8e8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#e74c3c',
        marginLeft: 8,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#27ae60',
        borderRadius: 12,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#27ae60',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotPasswordText: {
        color: '#3498db',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        color: '#7f8c8d',
        fontSize: 14,
    },
    signUpText: {
        color: '#27ae60',
        fontSize: 14,
        fontWeight: '600',
    },
    inputError: {
        borderColor: '#e74c3c',
        backgroundColor: '#fdf2f2',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 6,
        marginLeft: 8,
    },
});

export default LoginScreen;