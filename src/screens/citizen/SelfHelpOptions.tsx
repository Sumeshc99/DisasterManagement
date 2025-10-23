import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Linking,
    Alert,
    ScrollView,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SelfHelpModalProps {
    visible: boolean;
    onClose: () => void;
}

const SelfHelpModal: React.FC<SelfHelpModalProps> = ({ visible, onClose }) => {
    const [tapCount, setTapCount] = useState(0);

    const makeCall = (number: string) => {
        const phoneNumber = `tel:${number}`;
        Linking.canOpenURL(phoneNumber)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(phoneNumber);
                } else {
                    Alert.alert('Error', 'Unable to make call');
                }
            })
            .catch((err) => console.error('Error making call:', err));
    };

    const handleCancelTap = () => {
        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount >= 3) {
            Alert.alert('Success', 'Incident report cancelled');
            setTapCount(0);
            onClose();
        } else {
            Alert.alert('Info', `Tap ${3 - newCount} more time${3 - newCount > 1 ? 's' : ''} to cancel`);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>

                        {/* Title */}
                        <Text style={styles.title}>Self-Help Options</Text>

                        {/* Description */}
                        <Text style={styles.description}>
                            While we alert your emergency contacts & notify nearby app users,
                            please call below helpline numbers immediately.
                        </Text>

                        {/* Primary Call Button */}
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => makeCall('112')}
                        >
                            <Text style={styles.callIcon}>📞</Text>
                            <Text style={styles.primaryButtonText}>112</Text>
                        </TouchableOpacity>

                        {/* Alternate Call Label */}
                        <Text style={styles.alternateLabel}>Alternate call</Text>

                        {/* Police and Ambulance Buttons */}
                        <View style={styles.alternateRow}>
                            <TouchableOpacity
                                style={styles.alternateButton}
                                onPress={() => makeCall('100')}
                            >
                                <Text style={styles.alternateIcon}>📞</Text>
                                <Text style={styles.alternateButtonText}>100</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.alternateButton}
                                onPress={() => makeCall('108')}
                            >
                                <Text style={styles.alternateIcon}>📞</Text>
                                <Text style={styles.alternateButtonText}>108</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Labels for Police and Ambulance */}
                        <View style={styles.labelsRow}>
                            <Text style={styles.serviceLabel}>Police</Text>
                            <Text style={styles.serviceLabel}>Ambulance</Text>
                        </View>

                        {/* Help Message */}
                        <Text style={styles.helpMessage}>
                            Please reach out to nearby services for help till we notify our
                            Responders.
                        </Text>

                        {/* Service Cards */}
                        <View style={styles.servicesGrid}>
                            <TouchableOpacity style={styles.serviceCard}>
                                <Image
                                    source={require('../../assets/clinic.png')}
                                    resizeMode="contain"
                                    style={{ width: 70, height: 70 }}
                                />
                                <Text style={styles.serviceCardText}>Clinic/Hospital</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <Text style={styles.serviceIcon}>👮</Text>
                                <Text style={styles.serviceCardText}>Police Station</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <Text style={styles.serviceIcon}>🚑</Text>
                                <Text style={styles.serviceCardText}>Ambulances</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <Text style={styles.serviceIcon}>🚒</Text>
                                <Text style={styles.serviceCardText}>Fire Brigades</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancelTap}
                        >
                            <View style={styles.cancelButtonInner}>
                                <Text style={styles.cancelIcon}>✕</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Cancel Instructions */}
                        <Text style={styles.cancelText}>
                            Tap 3 times to cancel the incident report
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

// Example Usage Component
const SelfHelpOptions: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={styles.exampleContainer}>
            <TouchableOpacity
                style={styles.openButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.openButtonText}>Open Self-Help Options</Text>
            </TouchableOpacity>

            <SelfHelpModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
};

export default SelfHelpOptions;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '90%',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0D5FB3',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    closeIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#0D5FB3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 25,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    callIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    alternateLabel: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 12,
    },
    alternateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8,
    },
    alternateButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#0D5FB3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 25,
    },
    alternateIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    alternateButtonText: {
        color: '#0D5FB3',
        fontSize: 16,
        fontWeight: '700',
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    serviceLabel: {
        fontSize: 13,
        color: '#666666',
        fontWeight: '600',
    },
    helpMessage: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    serviceCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    serviceIcon: {
        fontSize: 36,
        marginBottom: 8,
    },
    serviceCardText: {
        fontSize: 12,
        color: '#333333',
        fontWeight: '600',
        textAlign: 'center',
    },
    cancelButton: {
        alignSelf: 'center',
        marginBottom: 12,
    },
    cancelButtonInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF0000',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 6,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    cancelIcon: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
    },
    cancelText: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 8,
    },
    // Example Container Styles
    exampleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    openButton: {
        backgroundColor: '#0D5FB3',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 25,
    },
    openButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});