import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import { WIDTH } from '../../../themes/AppConst';
import ApiManager from '../../../apis/ApiManager';

interface ResponderItem {
  id: string;
  name: string;
  location: string;
  image: any;
}

const HomeScreen: React.FC = () => {
  const [hospitalList, sethospitalList] = useState<any[]>([]);
  const [ambulance, setambulance] = useState<any[]>([]);
  const [policeStation, setpoliceStation] = useState<any[]>([]);
  const [sdrfCenter, setsdrfCenter] = useState<any[]>([]);

  useEffect(() => {
    const fetchResponderList = async () => {
      try {
        const resp = await ApiManager.responderList();

        if (resp?.data?.success) {
          const data = resp?.data?.data?.results || [];
          if (data.length > 0) {
            const hospitals = data.filter(
              (item: any) => item.resource_type === 'Hospital',
            );
            sethospitalList(hospitals);

            const ambulance = data.filter(
              (item: any) => item.resource_type === 'Ambulance',
            );
            setambulance(ambulance);

            const policeStation = data.filter(
              (item: any) => item.resource_type === 'Police Station',
            );
            setpoliceStation(policeStation);

            const sdrfCenter = data.filter(
              (item: any) => item.resource_type === 'SDRF Center',
            );
            setsdrfCenter(sdrfCenter);
          }
        }
      } catch (err) {
        console.error('Error fetching responder list:', err);
      }
    };

    fetchResponderList();
  }, []);

  const renderSection = (title: string, items: ResponderItem[]) => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {items.map((item: any) => (
          <TouchableOpacity key={item.id} style={styles.listItem}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.owner_full_name}</Text>
              <Text style={styles.itemLocation}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D5FB3" />

      {/* Header */}
      <DashBoardHeader />

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>On-Duty Responders</Text>

        {ambulance.length > 0 && renderSection('Ambulance service', ambulance)}
        {hospitalList.length > 0 && renderSection('Hospital', hospitalList)}
        {policeStation.length > 0 &&
          renderSection('Police Stations', policeStation)}
        {sdrfCenter.length > 0 && renderSection('SDRF Center', sdrfCenter)}
      </ScrollView>

      {/* Floating Action Buttons */}
      <View
        style={{
          position: 'absolute',
          gap: 14,
          bottom: WIDTH(14),
          right: 10,
        }}
      >
        <Image
          source={require('../../../../src/assets/res2.png')}
          resizeMode="contain"
          style={{ width: 70, height: 70 }}
        />
        <Image
          source={require('../../../../src/assets/res3.png')}
          resizeMode="contain"
          style={{ width: 70, height: 70 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#0D5FB3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#0D5FB3',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0D5FB3',
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D5FB3',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D5FB3',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#888888',
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    gap: 16,
  },
  fabSecondary: {
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 28,
    backgroundColor: '#0D5FB3',
    width: 56,
    height: 56,
    borderRadius: 28,
    textAlign: 'center',
    lineHeight: 56,
    color: '#FFFFFF',
    overflow: 'hidden',
  },
  fabLabel: {
    backgroundColor: '#666666',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  fabLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  navText: {
    fontSize: 14,
    color: '#0D5FB3',
    fontWeight: '600',
  },
  sosButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    borderWidth: 6,
    borderColor: '#FFFFFF',
  },
  sosIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sosText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: -4,
  },
});
