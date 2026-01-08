import React, { forwardRef, useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import ApiManager from '../../apis/ApiManager';

interface TimelineItem {
  role: string;
  status: string;
  incidentType: string;
  date: string;
  location: string;
  title?: string | null;
  name?: string | null;
}

interface Props {
  incidentId: number | null;
  onClose?: () => void;
}

const TimelineSheet = forwardRef<RBSheet, Props>(
  ({ incidentId, onClose }: any, ref) => {
    const { userToken } = useSelector((state: RootState) => state.auth);
    const [timelineData, setTimelineData] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log('The timeline day', timelineData);

    useEffect(() => {
      if (incidentId) {
        console.log('Incident Id/////// ', incidentId);
        fetchTimeline();
      }
    }, [incidentId]);

    const fetchTimeline = async () => {
      try {
        setLoading(true);

        const resp = await ApiManager.getTimelineNew(incidentId, userToken);
        console.log('Full response', JSON.stringify(resp.data, null, 2));

        if (resp?.data?.status) {
          console.log('Yeahhhhh we are getting daa');
          setTimelineData(resp.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <RBSheet
        ref={ref}
        height={520}
        openDuration={250}
        onOpen={() => {
          if (incidentId) {
            fetchTimeline();
          }
        }}
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
          <View style={styles.dragIndicator} />
          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 32 }} />

            <Text style={styles.title}>Incident Timeline</Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                ref?.current?.close();
                onClose && onClose();
              }}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Timeline */}
          <ScrollView showsVerticalScrollIndicator>
            {timelineData.map((item: any, index) => (
              <View key={index} style={styles.timelineItem}>
                {/* Left Column */}
                <View style={styles.dotContainer}>
                  <View style={styles.circle}>
                    <Text style={styles.circleText}>{item.role}</Text>
                  </View>

                  {index < timelineData.length - 1 && (
                    <View style={styles.verticalLine} />
                  )}
                </View>

                {/* Right Content */}
                <View style={styles.content}>
                  <Text style={styles.status}>{item.status}</Text>

                  <Text style={styles.incidentType}>
                    {item.incidentType} · {item.date}
                  </Text>

                  <Text style={styles.location}>{item.location}</Text>

                  {item.title && (
                    <Text style={styles.detailTitle}>{item.title}</Text>
                  )}

                  {item.name && (
                    <Text style={styles.detailValue}>{item.name}</Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </RBSheet>
    );
  },
);

export default TimelineSheet;

const styles = StyleSheet.create({
  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.blue,
    marginVertical: 4,
  },
  closeBtn: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: COLOR.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* TIMELINE */
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  dotContainer: {
    width: 70,
    alignItems: 'center',
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: COLOR.blue,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLOR.blue,
    textAlign: 'center',
    lineHeight: 12,
  },
  verticalLine: {
    width: 1,
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    // marginTop: 6,
  },

  /* CONTENT */
  content: {
    flex: 1,
    paddingBottom: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.blue,
  },
  incidentType: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    color: '#333',
  },
  location: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  detailValue: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
});
