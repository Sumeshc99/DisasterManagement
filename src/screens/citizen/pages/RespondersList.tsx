import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface props {
  responders: any[];
}

interface ResponderItem {
  id: string;
  owner_full_name: string;
  tehsil_name: string;
  resource_type: string;
  image?: any;
}

const RespondersList: React.FC<props> = ({ responders }) => {
  const categorized = useMemo(() => {
    const categories = {
      Hospital: [] as ResponderItem[],
      Ambulance: [] as ResponderItem[],
      'Police Station': [] as ResponderItem[],
      'SDRF Center': [] as ResponderItem[],
      Boat: [] as ResponderItem[],
    };

    responders.forEach(item => {
      if (item.resource_type in categories) {
        const key = item.resource_type as keyof typeof categories;
        categories[key].push(item);
      }
    });

    return categories;
  }, [responders]);

  const renderSection = (title: any, items: ResponderItem[]) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {items.map(item => (
          <TouchableOpacity key={item.id} style={styles.listItem}>
            {/* <Image source={{ uri: item.image }} style={styles.itemImage} /> */}
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.owner_full_name}</Text>
              <Text style={styles.itemLocation}>{item.tehsil_name}</Text>
            </View>
          </TouchableOpacity>
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
        <Text style={styles.pageTitle}>On-Duty Responders</Text>

        {renderSection('Ambulance Service', categorized.Ambulance)}
        {renderSection('Hospital', categorized.Hospital)}
        {renderSection('Police Stations', categorized['Police Station'])}
        {renderSection('SDRF Center', categorized['SDRF Center'])}
        {renderSection('Boat', categorized['Boat'])}
      </ScrollView>
    </View>
  );
};

export default React.memo(RespondersList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
});
