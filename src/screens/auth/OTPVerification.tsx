import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Image
} from 'react-native';

export default function OTPVerification() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const [timeLeft, setTimeLeft] = useState(540); // 9 minutes in seconds

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleKeyPress = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleNext = () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        Alert.alert('Success', `OTP Verified: ${otpString}`);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                {/* <View style={styles.logoBorder}> */}
                <Image
                    source={require('../../assets/logo.png')}
                    resizeMode="contain"
                    style={{ width: 100, height: 100, marginTop: 40 }}
                />
                {/* </View> */}
            </View>

            {/* Title */}
            <Text style={styles.title}>OTP Verification</Text>

            {/* Description */}
            <Text style={styles.description}>Please enter the OTP sent to</Text>
            <View style={styles.phoneContainer}>
                <Text style={styles.phoneNumber}>8626054838</Text>
                <TouchableOpacity style={styles.editIcon}>
                    <Text style={styles.editIconText}>✎</Text>
                </TouchableOpacity>
            </View>

            {/* OTP Input Fields */}
            <View style={styles.otpInputContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        style={styles.otpInput}
                        maxLength={1}
                        keyboardType="numeric"
                        value={digit}
                        onChangeText={(value) => handleKeyPress(index, value)}
                        placeholder=""
                        placeholderTextColor="#ccc"
                    />
                ))}
            </View>

            {/* Error Message */}
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠ {error}</Text>
                </View>
            ) : null}

            {/* Timer */}
            <Text style={styles.timerText}>
                OTP will expire in: <Text style={styles.timerValue}>{formatTime()} minutes</Text>
            </Text>

            {/* Next Button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        marginTop: 30,
    },
    contentContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    logoContainer: {
        width: 100,
        height: 100,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoBorder: {
        width: '100%',
        height: '100%',
        borderWidth: 4,
        borderColor: '#2563eb',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
    },
    description: {
        fontSize: 14,
        color: '#9ca3af',
        marginBottom: 6,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 8,
    },
    phoneNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    editIcon: {
        padding: 4,
    },
    editIconText: {
        fontSize: 16,
        color: '#9ca3af',
    },
    otpInputContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
        justifyContent: 'center',
    },
    otpInput: {
        width: 48,
        height: 48,
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    errorText: {
        fontSize: 13,
        color: '#ef4444',
    },
    timerText: {
        fontSize: 13,
        color: '#4b5563',
        marginBottom: 24,
    },
    timerValue: {
        fontWeight: '600',
        color: '#1f2937',
    },
    nextButton: {
        width: 130,
        paddingVertical: 12,
        backgroundColor: '#d1d5db',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4b5563',
    },
});