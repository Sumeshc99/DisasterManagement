import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { WIDTH } from '../../themes/AppConst';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import { TEXT } from '../../i18n/locales/Text';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface AssignProps {
  data: any;
}

const AssignResponderSheet = forwardRef<any, AssignProps>(({ data }, ref) => {
  const navigation = useNavigation();
  const { userToken } = useSelector((state: RootState) => state.auth);

  const [resources, setResources] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedResponders, setSelectedResponders] = useState<any[]>([]);
  const [error, setError] = useState('');

  // fetch responder types
  useEffect(() => {
    const getIncidentType = async () => {
      try {
        const resp = await ApiManager.incidentType(userToken);
        if (resp?.data?.success) {
          setResources(
            (resp?.data?.data?.resource_types || []).map((item: any) => ({
              label: item.name,
              value: item.id,
            })),
          );
        }
      } catch (err: any) {
        console.log('Incident Error:', err.response || err);
      }
    };
    getIncidentType();
  }, []);

  // Assign responder API
  const assignResponders = async () => {
    if (selectedResponders.length === 0) {
      setError('Please select at least one responder type.');
      return;
    }

    setError('');

    const ids = selectedResponders.map(item => item.value).join(',');

    const body = {
      incident_id: data?.id,
      responder_type_id: ids,
    };

    try {
      const resp = await ApiManager.assignResponders(body, userToken);
      if (resp?.data?.status) {
        (ref as any)?.current?.close();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'mainAppSelector' }],
          }),
        );
      }
    } catch (err: any) {
      console.log('Assign Error:', err.response || err);
    }
  };

  const toggleSelect = (item: any) => {
    if (selectedResponders.some(r => r.value === item.value)) {
      setSelectedResponders(prev => prev.filter(r => r.value !== item.value));
    } else {
      setSelectedResponders(prev => [...prev, item]);
    }
    setError('');
  };

  return (
    <RBSheet
      ref={ref}
      height={380}
      // closeOnDragDown={true}
      customStyles={{
        wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
        draggableIcon: { backgroundColor: '#ccc' },
        container: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      }}
    >
      <View style={styles.container}>
        <View style={styles.dragIndicator} />

        <View style={styles.headerRow}>
          <View style={{ paddingHorizontal: 40 }}>
            <Text style={styles.title}>{TEXT.assign_responders()}</Text>
          </View>

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

        {/* Dropdown */}
        <View>
          <TouchableOpacity
            style={[styles.dropdown, error ? { borderColor: 'red' } : {}]}
            onPress={() => setOpenDropdown(!openDropdown)}
          >
            <Text style={styles.dropdownText}>
              {selectedResponders.length > 0
                ? selectedResponders.map(i => i.label).join(', ')
                : 'Select'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {/* Error message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {openDropdown && (
            <View style={styles.dropdownListWrapper}>
              <ScrollView style={styles.dropdownList}>
                {resources.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.checkboxRow}
                    onPress={() => toggleSelect(item)}
                  >
                    <View style={styles.checkboxBox}>
                      {selectedResponders.some(r => r.value === item.value) && (
                        <View style={styles.checkboxTick} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={assignResponders}>
        <Text style={styles.saveText}>{TEXT.save()}</Text>
      </TouchableOpacity>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.blue,
    textAlign: 'center',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: COLOR.black,
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#888',
  },

  dropdownListWrapper: {
    maxHeight: 150,
    width: WIDTH(90),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
    position: 'absolute',
    top: 46,
    backgroundColor: '#fff',
  },
  dropdownList: {
    backgroundColor: '#f9f9f9',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxTick: {
    width: 12,
    height: 12,
    backgroundColor: COLOR.blue,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 15,
    color: COLOR.black,
  },

  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: 5,
    fontSize: 13,
  },

  saveBtn: {
    marginTop: 25,
    backgroundColor: COLOR.blue,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    margin: WIDTH(4),
    width: 170,
    alignSelf: 'center',
  },
  saveText: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: '600',
  },
  closeIconContainer: {
    right: 20,
    borderRadius: 20,
  },
  closeIcon: {
    width: 35,
    height: 35,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
});

export default AssignResponderSheet;
