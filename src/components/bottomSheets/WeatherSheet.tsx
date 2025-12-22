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
import LinearGradient from 'react-native-linear-gradient';
import { FONT, HEIGHT, WIDTH } from '../../themes/AppConst';
import { COLOR } from '../../themes/Colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

const API_KEY = 'a418225781f74bc8b4365504252212';

const WeatherSheet = forwardRef<React.ComponentRef<typeof RBSheet>>(
  (_, ref) => {
    const language = useSelector((state: RootState) => state.language.language);

    const [forecast, setForecast] = useState<any>(null);
    const [location, setLocation] = useState('');
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchWeather();
    }, []);

    const fetchWeather = () => {
      setLoading(true);

      Geolocation.getCurrentPosition(async pos => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7&alerts=yes&lang=${language}`,
          );

          const data = await res.json();

          setForecast(data.forecast.forecastday);
          setLocation(data.location.name);
          setAlerts(data.alerts?.alert || []);
          setLoading(false);
        } catch (e) {
          setLoading(false);
        }
      });
    };

    const today = forecast?.[0];

    return (
      <RBSheet
        ref={ref}
        height={720}
        closeOnPressMask
        customStyles={{ container: styles.container }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.location}>{location}</Text>
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
            <ActivityIndicator size="large" style={{ marginTop: HEIGHT(25) }} />
          ) : (
            <>
              {/* Today Card with Gradient */}
              <LinearGradient
                colors={['#1E3A8A', '#2563EB']}
                style={styles.todayCard}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 10,
                  }}
                >
                  <Image
                    source={{ uri: `https:${today?.day.condition.icon}` }}
                    style={styles.todayIcon}
                  />
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.todayLabel}>Today</Text>
                    <Text style={styles.todayTemp}>
                      {today?.day.avgtemp_c}°C
                    </Text>
                    <Text style={styles.todayDesc}>
                      {today?.day.condition.text} {today?.day.mintemp_c}° /{' '}
                      {today?.day.maxtemp_c}°
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Wind */}
              <Text style={styles.windText}>
                → {today?.day.maxwind_kph} km/h
              </Text>

              {/* 7 Day Forecast */}
              <FlatList
                data={forecast?.slice(1)}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <View style={styles.dayRow}>
                    <Text style={styles.dayText}>
                      {new Date(item.date).toLocaleDateString('en', {
                        weekday: 'short',
                      })}
                    </Text>

                    <Image
                      source={{ uri: `https:${item.day.condition.icon}` }}
                      style={styles.rowIcon}
                    />

                    <View style={styles.centerRow}>
                      <Text style={styles.cloudy}>
                        {item.day.condition.text}
                      </Text>
                      <Text style={styles.speed}>
                        {item.day.maxwind_kph} km/h
                      </Text>
                    </View>

                    <Text style={styles.tempRange}>
                      {item.day.mintemp_c}° - {item.day.maxtemp_c}°
                    </Text>
                  </View>
                )}
              />

              {/* Alerts */}
              {alerts.length > 0 && (
                <View style={styles.alertBar}>
                  <Text style={styles.alertText}>⚠ {alerts[0].headline}</Text>
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

  content: { flex: 1, padding: WIDTH(4) },
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    width: WIDTH(70),
    alignSelf: 'center',
    backgroundColor: COLOR.blue,
    borderRadius: 14,
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
    backgroundColor: '#F3F4F6',
    paddingVertical: WIDTH(2),
    paddingHorizontal: WIDTH(4),
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
  },

  dayText: {
    color: COLOR.blue,
    fontFamily: FONT.R_BOLD_700,
    width: WIDTH(10),
  },

  centerRow: { alignItems: 'center', width: WIDTH(30) },

  rowIcon: { width: WIDTH(10), height: WIDTH(10) },

  cloudy: { fontSize: 13 },

  speed: { fontSize: 12, color: '#6B7280' },

  tempRange: { fontWeight: '600', width: WIDTH(24) },

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
