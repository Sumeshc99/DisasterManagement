import React, { forwardRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { WIDTH } from '../../themes/AppConst';

interface TimelineItem {
  role: string;
  status: string;
  incidentType: string;
  date: string;
  location: string;
  details?: { title: string; name: string }[];
}

interface Props {
  timelineData: TimelineItem[];
  onClose?: () => void;
}

const TimelineSheet = forwardRef<RBSheet, Props>(
  ({ timelineData, onClose }, ref) => {
    return (
      <RBSheet
        ref={ref}
        height={500}
        openDuration={250}
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Incident Timeline</Text>
            <TouchableOpacity onPress={() => ref?.current?.close()}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Timeline Scroll */}
          <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
            {timelineData.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                {/* Dot and Line */}
                <View style={styles.dotContainer}>
                  <View style={styles.dot} />
                  {index < timelineData.length - 1 && (
                    <View style={styles.verticalLine} />
                  )}
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.role}>{item.role}</Text>
                  <Text style={styles.status}>{item.status}</Text>
                  <Text style={styles.incidentType}>{item.incidentType}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.location}>{item.location}</Text>

                  {item.details?.map((d, i) => (
                    <Text key={i} style={styles.detail}>
                      <Text style={{ fontWeight: 'bold' }}>{d.title}: </Text>
                      {d.name}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              ref?.current?.close();
              onClose && onClose();
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  },
);

export default TimelineSheet;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '700' },
  closeIcon: { fontSize: 20, color: COLOR.blue },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  dotContainer: { alignItems: 'center', width: 30 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLOR.blue,
    marginTop: 2,
  },
  verticalLine: { width: 2, flex: 1, backgroundColor: '#ccc', marginTop: 2 },
  content: { flex: 1, paddingLeft: 10 },
  role: { fontWeight: '700', color: COLOR.blue },
  status: { fontWeight: '600', marginTop: 2 },
  incidentType: { marginTop: 2, fontStyle: 'italic' },
  date: { marginTop: 2, color: '#555' },
  location: { marginTop: 2, color: '#555' },
  detail: { marginTop: 2, color: '#333' },
  closeButton: {
    backgroundColor: COLOR.blue,
    paddingVertical: 12,
    width: WIDTH(50),
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButtonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
