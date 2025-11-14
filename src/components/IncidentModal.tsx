import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface props {
  data: any;
  openModal: boolean;
  setOpenModal: Function;
}

const IncidentModal: React.FC<props> = ({ data, openModal, setOpenModal }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <Text style={styles.header}>Active Incident</Text>

        {/* Incident Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://www.k12digest.com/wp-content/uploads/2024/03/1-3-550x330.jpg',
            }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Tags */}
          <View style={styles.tagContainer}>
            <View style={[styles.tag, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.tagText}>Flood</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#5C4033' }]}>
              <Text style={styles.tagText}>Active</Text>
            </View>
          </View>

          {/* Arrows (optional placeholders) */}
          <TouchableOpacity style={[styles.arrowBtn, { left: 10 }]}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.arrowBtn, { right: 10 }]}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Incident Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.incidentTitle}>Flood emergency situation</Text>
          <Text style={styles.incidentLocation}>
            Near Nagpur Railway, Nagpur, 440001
          </Text>
          <Text style={styles.incidentDescription}>
            A severe flood situation has developed in my area, so urgent help is
            needed. The floodwater is rising rapidly, and I need immediate
            assistance. Please respond as soon as possible, as the situation is
            worsening quickly. Thank you.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default IncidentModal;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#F2F2F2',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#105AAA',
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  tagContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left: 10,
    gap: 8,
  },
  tag: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  arrowBtn: {
    position: 'absolute',
    top: '45%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  arrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#105AAA',
    marginBottom: 4,
  },
  incidentLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  incidentDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
