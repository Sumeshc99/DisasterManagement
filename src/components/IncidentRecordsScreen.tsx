// IncidentRecordsScreen.js (Updated for react-native-vector-icons)
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // <--- UPDATED IMPORT

const incidentRecords = [
    // ... your incident data (unchanged)
    {
        id: 'NAG-060825-CT-970',
        type: 'Accident',
        location: 'MIDC, Nagpur',
        date: '10 April 2025',
        time: '6:20 PM',
        status: 'New',
        image: 'https://i.imgur.com/2z2z2z2.png', // Replace with actual image source
    },
    {
        id: 'NAG-060825-CT-780',
        type: 'Fire',
        location: 'Sitabardi, Nagpur',
        date: '08 April 2025',
        time: '5:10 PM',
        status: 'Pending for Review',
        image: 'https://i.imgur.com/2z2z2z2.png', // Replace with actual image source
    },
    {
        id: 'NAG-060825-CT-643',
        type: 'Landslide',
        location: 'Reshim Bagh, Nagpur',
        date: '08 April 2025',
        time: '5:10 PM',
        status: 'Rejected',
        image: 'https://i.imgur.com/2z2z2z2.png', // Replace with actual image source
    },
    {
        id: 'NAG-060825-CT-435',
        type: 'Flood',
        location: 'Manish Nagar, Nagpur',
        date: '17 May 2024',
        time: '02:20 PM',
        status: 'Pending for Review',
        image: 'https://i.imgur.com/2z2z2z2.png', // Replace with actual image source
    },
    {
        id: 'NAG-060825-CT-234',
        type: 'Chemical Leak',
        location: 'MIDC, Nagpur', // Assuming location, not provided in image
        date: '05 May 2024', // Assuming date, not provided in image
        time: '10:00 AM', // Assuming time, not provided in image
        status: 'Rejected',
        image: 'https://i.imgur.com/2z2z2z2.png', // Replace with actual image source
    },
];

const getStatusStyle = (status) => {
    switch (status) {
        case 'New': return styles.statusNew;
        case 'Pending for Review': return styles.statusPending;
        case 'Rejected': return styles.statusRejected;
        default: return {};
    }
};

const getStatusTextStyle = (status) => {
    switch (status) {
        case 'New': return styles.statusTextNew;
        case 'Pending for Review': return styles.statusTextPending;
        case 'Rejected': return styles.statusTextRejected;
        default: return {};
    }
};

const IncidentRecordItem = ({ item }) => (
    <View style={styles.recordItem}>
        <View style={styles.recordHeader}>
            <Text style={styles.incidentId}>Incident ID - {item.id}</Text>
            <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>{item.status}</Text>
            </View>
        </View>
        <View style={styles.recordContent}>
            <Image source={{ uri: item.image }} style={styles.incidentImage} />
            <View style={styles.detailsContainer}>
                <Text style={styles.incidentType}>{item.type}</Text>
                <Text style={styles.incidentLocation}>{item.location}</Text>
                <Text style={styles.incidentDateTime}>Date: {item.date} Time: {item.time}</Text>
            </View>
            {item.status === 'New' && (
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
);

const IncidentRecordsScreen = ({ showHeader = true }) => {
    return (
        <View style={styles.container}>
            {showHeader && (
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Incident Records</Text>
                    <TouchableOpacity style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
            <FlatList
                data={incidentRecords}
                renderItem={({ item }) => <IncidentRecordItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        position: 'relative',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 5,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    recordItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    recordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    incidentId: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusNew: {
        backgroundColor: '#d4edda',
    },
    statusTextNew: {
        color: '#28a745',
    },
    statusPending: {
        backgroundColor: '#fff3cd',
    },
    statusTextPending: {
        color: '#ffc107',
    },
    statusRejected: {
        backgroundColor: '#f8d7da',
    },
    statusTextRejected: {
        color: '#dc3545',
    },
    recordContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    incidentImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    detailsContainer: {
        flex: 1,
    },
    incidentType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    incidentLocation: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    incidentDateTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    editButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default IncidentRecordsScreen;