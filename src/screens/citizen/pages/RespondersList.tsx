import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { TEXT } from '../../../i18n/locales/Text';
import { COLOR } from '../../../themes/Colors';
import { FONT, WIDTH } from '../../../themes/AppConst';

interface props {
  responders: any[];
}

interface ResponderItem {
  id: string;
  owner_full_name: string;
  tehsil_name: string;
  resource_type: string;
  image?: any;
  mobile?: string;
}

const RespondersList: React.FC<props> = ({ responders }) => {
  const categorized = useMemo(() => {
    const categories = {
      Hospital: [] as ResponderItem[],
      Ambulance: [] as ResponderItem[],
      'Police Station': [] as ResponderItem[],
      'SDRF Center': [] as ResponderItem[],
      Boat: [] as ResponderItem[],
      'Fire Brigrade': [] as ResponderItem[],
    };

    responders.forEach(item => {
      switch (item.resource_type) {
        case 'Clinic/Hospital':
          categories.Hospital.push(item);
          break;
        case 'Ambulance':
          categories.Ambulance.push(item);
          break;
        case 'Police':
          categories['Police Station'].push(item);
          break;
        case 'Fire Brigrade':
          categories['Fire Brigrade'].push(item);
          break;
        case 'SDRF Center':
          categories['SDRF Center'].push(item);
          break;
        case 'Boat':
          categories.Boat.push(item);
          break;
      }
    });

    return categories;
  }, [responders]);

  const makeCall = async (num: any) => {
    try {
      const cleaned = num.replace(/[^0-9+]/g, '');
      const url =
        Platform.OS === 'ios' ? `telprompt:${cleaned}` : `tel:${cleaned}`;
      await Linking.openURL(url);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Unable to make call');
    }
  };

  const renderSection = (title: any, items: ResponderItem[]) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {items.map(item => (
          <View key={item.id} style={styles.listItem}>
            {/* <Image source={{ uri: item.image }} style={styles.itemImage} /> */}
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.owner_full_name}</Text>
              <Text style={styles.itemLocation}>{item.tehsil_name}</Text>
            </View>
            <TouchableOpacity onPress={() => makeCall(item?.mobile)}>
              <Image
                style={{ width: 34, height: 34 }}
                resizeMode="contain"
                source={require('../../../assets/call.png')}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Text style={styles.pageTitle}>{TEXT.on_duty_responders()}</Text>

        {renderSection('Ambulence service', categorized.Ambulance)}
        {renderSection('Hospital', categorized.Hospital)}
        {renderSection('Police Station', categorized['Police Station'])}
        {renderSection('SDRF Center', categorized['SDRF Center'])}
        {renderSection('Boat', categorized['Boat'])}
        {renderSection('Fire Brigade', categorized['Fire Brigrade'])}
      </ScrollView>
    </View>
  );
};

export default React.memo(RespondersList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  content: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0D5FB3',
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {},
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: WIDTH(3),
    borderRadius: 6,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D5FB3',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: WIDTH(3),
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
    fontSize: 12,
    color: COLOR.darkGray,
    fontFamily: FONT.R_SBD_600,
  },
});
