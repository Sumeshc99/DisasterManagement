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

const WEATHER_MAP: any = {
  0: { text: 'Clear sky', icon: '☀️' },
  1: { text: 'Mainly clear', icon: '🌤️' },
  2: { text: 'Partly cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Fog', icon: '🌫️' },
  48: { text: 'Fog', icon: '🌫️' },
  51: { text: 'Drizzle', icon: '🌦️' },
  61: { text: 'Rain', icon: '🌧️' },
  71: { text: 'Snow', icon: '❄️' },
  95: { text: 'Thunderstorm', icon: '⛈️' },
};

const WeatherSheet = forwardRef<React.ComponentRef<typeof RBSheet>>(
  (_, ref) => {
    const language = useSelector((state: RootState) => state.language.language);

    const [forecast, setForecast] = useState<any[]>([]);
    const [location, setLocation] = useState('Current Location');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchWeather();
    }, []);

    const fetchWeather = () => {
      setLoading(true);

      Geolocation.getCurrentPosition(
        async pos => {
          try {
            const { latitude, longitude } = pos.coords;

            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Asia/Kolkata`,
            );

            const data = await res.json();
            // console.log('weather', data);

            const days = data.daily.time.map((date: string, i: number) => ({
              date,
              code: data.daily.weathercode[i],
              min: data.daily.temperature_2m_min[i],
              max: data.daily.temperature_2m_max[i],
              wind: data.daily.windspeed_10m_max[i],
            }));

            setForecast(days);
            setLoading(false);
          } catch (e) {
            setLoading(false);
          }
        },
        () => setLoading(false),
        { enableHighAccuracy: true },
      );
    };

    const today = forecast[0];
    const todayWeather = WEATHER_MAP[today?.code] || {};

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
              {/* TODAY CARD */}
              <LinearGradient
                colors={['#1E3A8A', '#2563EB']}
                style={styles.todayCard}
              >
                <Text style={styles.todayIcon}>{todayWeather.icon}</Text>

                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.todayLabel}>Today</Text>
                  <Text style={styles.todayTemp}>{today?.max}°C</Text>
                  <Text style={styles.todayDesc}>
                    {todayWeather.text} {today?.min}° / {today?.max}°
                  </Text>
                </View>
              </LinearGradient>

              {/* WIND */}
              <Text style={styles.windText}>→ {today?.wind} km/h</Text>

              {/* 7 DAY FORECAST */}
              <FlatList
                data={forecast.slice(1)}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => {
                  const weather = WEATHER_MAP[item.code] || {};
                  return (
                    <View style={styles.dayRow}>
                      <Text style={styles.dayText}>
                        {new Date(item.date).toLocaleDateString('en', {
                          weekday: 'short',
                        })}
                      </Text>

                      <Text style={styles.rowEmoji}>{weather.icon}</Text>

                      <View style={styles.centerRow}>
                        <Text style={styles.cloudy}>{weather.text}</Text>
                        <Text style={styles.speed}>{item.wind} km/h</Text>
                      </View>

                      <Text style={styles.tempRange}>
                        {item.min}° - {item.max}°
                      </Text>
                    </View>
                  );
                }}
              />
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
  },

  closeIconContainer: {
    position: 'absolute',
    right: 4,
  },

  closeIcon: {
    width: 30,
    height: 30,
  },

  todayCard: {
    marginTop: 16,
    width: WIDTH(86),
    alignSelf: 'center',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },

  todayIcon: {
    fontSize: 42,
  },

  todayLabel: {
    color: '#fff',
    fontSize: 16,
  },

  todayTemp: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },

  todayDesc: {
    color: '#E5E7EB',
  },

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

  centerRow: {
    alignItems: 'center',
    width: WIDTH(30),
  },

  rowEmoji: {
    fontSize: 22,
  },

  cloudy: {
    fontSize: 13,
  },

  speed: {
    fontSize: 12,
    color: '#6B7280',
  },

  tempRange: {
    fontWeight: '600',
    width: WIDTH(24),
  },
});
