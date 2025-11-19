import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { WIDTH } from '../../themes/AppConst';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

interface props {
  ref: any;
  data: any;
}

const AssignResponderSheet: React.FC<props> = forwardRef((data, ref) => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  const [resourses, setresourses] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedResponders, setSelectedResponders] = useState<any[]>([]);

  useEffect(() => {
    const getIncidentType = async () => {
      try {
        const resp = await ApiManager.incidentType(userToken);

        if (resp?.data?.success) {
          setresourses(
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

  const assignResponders = async () => {
    const ids = selectedResponders.map(item => item.value).join(',');

    const body = {
      incident_id: data?.data?.id,
      responder_type_id: ids,
    };

    try {
      const resp = await ApiManager.assignResponders(body, userToken);
      if (resp?.data?.status) {
        (ref as any)?.current?.close();
      }
    } catch (err: any) {
      console.log('Incident Error:', err.response || err);
    }
  };

  const toggleSelect = (item: any) => {
    if (selectedResponders.some(r => r.value === item.value)) {
      setSelectedResponders(prev => prev.filter(r => r.value !== item.value));
    } else {
      setSelectedResponders(prev => [...prev, item]);
    }
  };

  return (
    <RBSheet
      ref={ref}
      height={380}
      closeOnDragDown={true}
      customStyles={{
        wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
        draggableIcon: { backgroundColor: '#ccc' },
        container: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      }}
    >
      <View style={styles.container}>
        <View style={styles.dragIndicator} />

        <Text style={styles.title}>
          Assign responders to the incident report
        </Text>

        {/* Multi Select Dropdown */}
        <View>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setOpenDropdown(!openDropdown)}
          >
            <Text style={styles.dropdownText}>
              {selectedResponders.length > 0
                ? selectedResponders.map(i => i.label).join(', ')
                : 'Select'}
            </Text>

            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {/* Scrollable Checkbox List */}
          {openDropdown && (
            <View style={styles.dropdownListWrapper}>
              <ScrollView style={styles.dropdownList}>
                {resourses.map((item: any) => (
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
      <TouchableOpacity style={styles.saveBtn} onPress={assignResponders}>
        <Text style={styles.saveText}>Save</Text>
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
    marginBottom: 20,
    width: WIDTH(60),
    alignSelf: 'center',
  },

  // Dropdown button
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: COLOR.black,
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#888',
  },

  // Scrollable dropdown
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
  },
  dropdownList: {
    backgroundColor: '#f9f9f9',
  },

  // Checkbox rows
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

  // Save button
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
});

export default AssignResponderSheet;
