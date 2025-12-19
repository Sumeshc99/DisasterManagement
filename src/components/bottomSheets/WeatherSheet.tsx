import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Geolocation from '@react-native-community/geolocation';
import { HEIGHT, WIDTH } from '../../themes/AppConst';
import { COLOR } from '../../themes/Colors';

interface Props {}

const WeatherSheet = forwardRef<React.ComponentRef<typeof RBSheet>>(
  (_, ref) => {
    const [daily, setDaily] = useState<any>(null);
    const [location, setLocation] = useState('');
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchWeather();
    }, []);

    const fetchWeather = async () => {
      setLoading(true);

      Geolocation.getCurrentPosition(async pos => {
        try {
          const { latitude, longitude } = pos.coords;

          const locRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}`,
          );
          const locData = await locRes.json();
          setLocation(locData?.results?.[0]?.name || 'Current Location');

          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,weathercode&alerts=weather&timezone=auto`,
          );
          const data = await res.json();

          setDaily(data.daily);
          setAlerts(data.alerts || []);
          setLoading(false);
        } catch {
          setLoading(false);
        }
      });
    };

    return (
      <RBSheet
        ref={ref}
        height={600}
        closeOnPressMask
        customStyles={{ container: styles.container }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.location}>Nagpur</Text>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => (ref as any)?.current?.close()}
            >
              <Image
                source={require('../../assets/cancel.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator style={{ marginTop: HEIGHT(25) }} size="large" />
          ) : (
            <>
              {/* Today Card */}
              <View style={styles.todayCard}>
                <Image
                  source={require('../../assets/cancel.png')}
                  style={styles.todayIcon}
                />
                <View>
                  <Text style={styles.todayLabel}>Today</Text>
                  <Text style={styles.todayTemp}>
                    {daily?.temperature_2m_max?.[0]}°C
                  </Text>
                  <Text style={styles.todayDesc}>
                    Sunny {daily?.temperature_2m_min?.[0]}° /
                    {daily?.temperature_2m_max?.[0]}°
                  </Text>
                </View>
              </View>

              {/* Wind */}
              <Text style={styles.windText}>
                → {daily?.windspeed_10m_max?.[0]} km/h
              </Text>

              {/* Daily List */}
              <FlatList
                data={daily?.time?.slice(1)}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.dayRow}>
                    <Text style={styles.dayText}>
                      {new Date(item).toLocaleDateString('en', {
                        weekday: 'short',
                      })}
                    </Text>

                    <View style={styles.centerRow}>
                      <Image
                        source={require('../../assets/cancel.png')}
                        style={styles.rowIcon}
                      />
                      <Text style={styles.cloudy}>Cloudy</Text>
                      <Text style={styles.speed}>
                        {daily.windspeed_10m_max[index + 1]} km/h
                      </Text>
                    </View>

                    <Text style={styles.tempRange}>
                      {daily.temperature_2m_min[index + 1]}°{' '}
                      {daily.temperature_2m_max[index + 1]}°
                    </Text>
                  </View>
                )}
              />

              {/* Alert */}
              {alerts.length > 0 && (
                <View style={styles.alertBar}>
                  <Text style={styles.alertText}>⚠ Heavy Rainfall Warning</Text>
                </View>
              )}
            </>
          )}
        </View>
      </RBSheet>
    );
  },
);

export default WeatherSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  content: { flex: 1, padding: 16 },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
    marginTop: 6,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  location: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.blue,
    textAlign: 'center',
  },

  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLOR.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  todayCard: {
    backgroundColor: COLOR.blue,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    width: WIDTH(70),
    alignSelf: 'center',
  },

  todayIcon: { width: 60, height: 60, marginRight: 12 },

  todayLabel: { color: '#fff', fontSize: 16 },

  todayTemp: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },

  todayDesc: { color: '#E5E7EB' },

  windText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: COLOR.blue,
  },

  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
  },

  dayText: { fontWeight: '700', color: COLOR.blue },

  centerRow: { alignItems: 'center' },

  rowIcon: { width: 26, height: 26 },

  cloudy: { fontSize: 13 },

  speed: { fontSize: 12, color: '#6B7280' },

  tempRange: { fontWeight: '600' },

  alertBar: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  closeIconContainer: {
    position: 'absolute',
    right: 4,
    borderRadius: 20,
  },

  closeIcon: {
    width: 30,
    height: 30,
  },

  alertText: { color: '#fff', fontWeight: '700' },
});
