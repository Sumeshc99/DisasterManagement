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

/* -------------------- LANGUAGE STRINGS -------------------- */
const STRINGS: any = {
  en: {
    today: 'Today',
    currentLocation: 'Current Location',
    windUnit: 'km/h',
    weatherAlerts: 'Weather Alerts',
    days: {
      clear: 'Clear sky',
      mainlyClear: 'Mainly clear',
      partlyCloudy: 'Partly cloudy',
      overcast: 'Overcast',
      fog: 'Fog',
      drizzle: 'Drizzle',
      rain: 'Rain',
      snow: 'Snow',
      thunderstorm: 'Thunderstorm',
    },
  },
  hi: {
    today: 'आज',
    currentLocation: 'वर्तमान स्थान',
    windUnit: 'कि.मी./घं',
    weatherAlerts: 'मौसम चेतावनी',
    days: {
      clear: 'साफ आसमान',
      mainlyClear: 'मुख्यतः साफ',
      partlyCloudy: 'आंशिक बादल',
      overcast: 'घने बादल',
      fog: 'कोहरा',
      drizzle: 'बूंदाबांदी',
      rain: 'बारिश',
      snow: 'बर्फबारी',
      thunderstorm: 'आंधी तूफान',
    },
  },
  mr: {
    today: 'आज',
    currentLocation: 'सध्याचे स्थान',
    windUnit: 'कि.मी./ता',
    weatherAlerts: 'हवामान चेतावणी',
    days: {
      clear: 'स्वच्छ आकाश',
      mainlyClear: 'मुख्यतः स्वच्छ',
      partlyCloudy: 'अंशतः ढगाळ',
      overcast: 'ढगाळ',
      fog: 'धुके',
      drizzle: 'रिमझिम पाऊस',
      rain: 'पाऊस',
      snow: 'हिमवृष्टी',
      thunderstorm: 'वादळी पाऊस',
    },
  },
};

/* -------------------- WEATHER MAP -------------------- */
const WEATHER_MAP: any = {
  0: { key: 'clear', icon: '☀️' },
  1: { key: 'mainlyClear', icon: '🌤️' },
  2: { key: 'partlyCloudy', icon: '⛅' },
  3: { key: 'overcast', icon: '☁️' },
  45: { key: 'fog', icon: '🌫️' },
  48: { key: 'fog', icon: '🌫️' },
  51: { key: 'drizzle', icon: '🌦️' },
  61: { key: 'rain', icon: '🌧️' },
  71: { key: 'snow', icon: '❄️' },
  95: { key: 'thunderstorm', icon: '⛈️' },
};

/* -------------------- OPENSTREETMAP REVERSE GEOCODE -------------------- */
const reverseGeocodeOSM = async (
  latitude: number,
  longitude: number,
  defaultLocation: string,
  lang: string = 'en',
) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ReactNativeWeatherApp',
          'Accept-Language': lang,
        },
      },
    );
    const data = await res.json();
    const address = data.address || {};

    const area =
      address.suburb ||
      address.neighbourhood ||
      address.village ||
      address.town ||
      '';

    const city =
      address.city ||
      address.county ||
      address.state_district ||
      address.state ||
      '';

    if (area && city) return `${area}, ${city}`;
    if (city) return city;

    return defaultLocation;
  } catch (e) {
    return defaultLocation;
  }
};

/* -------------------- WEATHER SHEET COMPONENT -------------------- */
const WeatherSheet = forwardRef<React.ComponentRef<typeof RBSheet>>(
  (_, ref) => {
    const language =
      useSelector((state: RootState) => state.language.language) || 'en';
    const t = STRINGS[language] || STRINGS.en;

    const locationData = useSelector(
      (state: RootState) => state?.location?.currentLocation,
    );

    const [forecast, setForecast] = useState<any[]>([]);
    const [location, setLocation] = useState(t.currentLocation);
    const [loading, setLoading] = useState(false);
    const [weatherAlerts, setWeatherAlerts] = useState<any[]>([]);

    /* -------------------- FETCH WEATHER & ALERTS -------------------- */
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
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Asia/Kolkata&alerts=1`,
            );
            const data = await res.json();

            // Daily forecast
            const days = data.daily.time.map((date: string, i: number) => ({
              date,
              code: data.daily.weathercode[i],
              min: data.daily.temperature_2m_min[i],
              max: data.daily.temperature_2m_max[i],
              wind: data.daily.windspeed_10m_max[i],
            }));
            setForecast(days);

            // Weather alerts
            if (data.alerts && data.alerts.length > 0) {
              setWeatherAlerts(data.alerts);
            } else {
              setWeatherAlerts([]);
            }
          } catch (e) {
            console.log('Weather fetch error', e);
          } finally {
            setLoading(false);
          }
        },
        () => setLoading(false),
        { enableHighAccuracy: true },
      );
    };

    /* -------------------- GET AREA + CITY -------------------- */
    useEffect(() => {
      if (locationData?.latitude && locationData?.longitude) {
        reverseGeocodeOSM(
          locationData.latitude,
          locationData.longitude,
          t.currentLocation,
          language,
        ).then(place => setLocation(place));
      }
    }, [locationData, language]);

    const today = forecast[0];
    const todayWeather = WEATHER_MAP[today?.code] || {};

    /* -------------------- UI -------------------- */
    return (
      <RBSheet
        ref={ref}
        height={720}
        closeOnPressMask
        customStyles={{ container: styles.container }}
        onOpen={() => {
          fetchWeather(); // ✅ refresh every time sheet opens
        }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />

          {/* HEADER */}
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
                <View style={styles.todayRow}>
                  <Text style={styles.todayIcon}>{todayWeather.icon}</Text>
                  <View style={styles.todayTextBlock}>
                    <Text style={styles.todayLabel}>{t.today}</Text>
                    <Text style={styles.todayTemp}>{today?.max}°C</Text>
                    <Text style={styles.todayDesc}>
                      {t.days[todayWeather.key]} {today?.min}° / {today?.max}°
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              {/* WIND */}
              <View style={styles.windRow}>
                <Text style={styles.windArrow}>→</Text>
                <Text style={styles.windValue}>
                  {today?.wind} {t.windUnit}
                </Text>
              </View>

              {/* 7-DAY FORECAST */}
              <FlatList
                data={forecast.slice(1)}
                showsVerticalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => {
                  const weather = WEATHER_MAP[item.code] || {};
                  return (
                    <View style={styles.dayRow}>
                      <Text style={styles.dayText}>
                        {new Date(item.date).toLocaleDateString(language, {
                          weekday: 'short',
                        })}
                      </Text>

                      <Text style={styles.rowEmoji}>{weather.icon}</Text>

                      <View style={styles.centerRow}>
                        <Text style={styles.cloudy}>{t.days[weather.key]}</Text>
                        <Text style={styles.speed}>
                          {item.wind} {t.windUnit}
                        </Text>
                      </View>

                      <Text style={styles.tempRange}>
                        {item.min}° - {item.max}°
                      </Text>
                    </View>
                  );
                }}
              />

              {/* WEATHER ALERTS */}
              {weatherAlerts.length > 0 && (
                <View
                  style={{
                    padding: 10,
                    backgroundColor: '#FFEEAA',
                    borderRadius: 8,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      color: '#AA5500',
                      fontWeight: '700',
                      marginBottom: 4,
                    }}
                  >
                    ⚠️ {t.weatherAlerts}
                  </Text>
                  {weatherAlerts.map((alert, index) => (
                    <Text
                      key={index}
                      style={{
                        color: '#AA5500',
                        fontWeight: '600',
                        fontSize: 12,
                      }}
                    >
                      {alert.event}: {alert.description}
                    </Text>
                  ))}
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

/* -------------------- STYLES -------------------- */
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
  location: { fontSize: 20, fontWeight: '700', color: COLOR.blue },
  closeIconContainer: { position: 'absolute', right: 4 },
  closeIcon: { width: 30, height: 30 },
  todayCard: {
    marginTop: 16,
    width: WIDTH(92),
    alignSelf: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  todayIcon: { fontSize: 60 },
  todayLabel: { color: '#fff', fontSize: 16, fontFamily: FONT.R_MED_500 },
  todayTemp: { color: '#fff', fontSize: 34, fontFamily: FONT.R_MED_500 },
  todayDesc: { color: '#E5E7EB' },
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
  dayText: { color: COLOR.blue, fontFamily: FONT.R_BOLD_700, width: WIDTH(10) },
  centerRow: { alignItems: 'center', width: WIDTH(30) },
  rowEmoji: { fontSize: 22 },
  cloudy: { fontSize: 13, fontFamily: FONT.R_BOLD_700, color: COLOR.textGrey },
  speed: { fontSize: 12, color: COLOR.textGrey, fontFamily: FONT.R_BOLD_700 },
  tempRange: { color: COLOR.textGrey, fontWeight: '600', width: WIDTH(24) },
  todayRow: { flexDirection: 'row', alignItems: 'center' },
  todayTextBlock: { marginLeft: 20 },
  windRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  windArrow: {
    fontSize: 26,
    color: COLOR.darkGray,
    marginRight: 6,
    marginTop: -9,
  },
  windValue: { fontSize: 16, color: COLOR.blue },
});
