import React, { forwardRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { RadioButton, TextInput } from 'react-native-paper';
import { COLOR } from '../../themes/Colors';
import { FONT, WIDTH } from '../../themes/AppConst';
import DropDownInput from '../inputs/DropDownInput';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import { useForm } from 'react-hook-form';
import { useGlobalLoader } from '../../hooks/GlobalLoaderContext';
import { useSnackbar } from '../../hooks/SnackbarProvider';
import { TEXT } from '../../i18n/locales/Text';

interface props {
  ref: any;
  data: any;
}

const RejectReasonSheet1: React.FC<props> = forwardRef((data, ref: any) => {
  const { userToken } = useSelector((state: RootState) => state.auth);

  const { showLoader, hideLoader } = useGlobalLoader();
  const snackbar = useSnackbar();

  const [selectedReason, setSelectedReason] = useState<'duplicate' | 'cancel'>(
    'duplicate',
  );
  const [idList, setidList] = useState([]);
  const [details, setDetails] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      insId: '',
      reason: '',
    },
  });

  useEffect(() => {
    const getIncidentIds = () => {
      ApiManager.getIncidentIds(userToken)
        .then(resp => {
          if (resp.data.status) {
            setidList(
              (resp?.data?.data || []).map((item: any) => ({
                label: item.incident_id,
                value: item.id,
              })),
            );
          }
        })
        .catch(err => console.log('err', err.response))
        .finally(() => '');
    };

    getIncidentIds();
  }, []);

  const incidentUpdateStatus = (item: any) => {
    const body = {
      incident_id: data.data.id,
      button_type: selectedReason === 'duplicate' ? 'Duplicate' : 'Cancel',
      cancel_reason: selectedReason === 'duplicate' ? 'Duplicate' : 'Cancel',
      duplicate_incident_id: selectedReason === 'duplicate' ? item?.insId : '',
      reason_for_cancellation: selectedReason === 'cancel' ? details : '',
    };

    showLoader();
    ApiManager.incidentStatusUpdate(body, userToken)
      .then(resp => {
        if (resp.data.status) {
          snackbar(resp?.data?.message, 'success');
          ref?.current?.close();
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => hideLoader());
  };

  return (
    <RBSheet
      ref={ref}
      height={480}
      customStyles={{
        wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
        draggableIcon: { backgroundColor: '#ccc' },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <View style={styles.container}>
        <View style={styles.dragIndicator} />

        <View style={styles.headerRow}>
          <Text style={styles.titleHeader}>
            {TEXT.select_reason_rejection()}
          </Text>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => (ref as { current: any })?.current?.close()}
          >
            <Image
              source={require('../../assets/cancel.png')}
              style={{ width: WIDTH(8), height: WIDTH(8) }}
            />
          </TouchableOpacity>
        </View>
        {/* Radio Buttons */}
        <View style={styles.radioRow}>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              selectedReason === 'duplicate' && styles.radioBtnActiveBlue,
            ]}
            onPress={() => setSelectedReason('duplicate')}
          >
            <RadioButton
              value="duplicate"
              status={selectedReason === 'duplicate' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedReason('duplicate')}
              color={COLOR.white}
              uncheckedColor={COLOR.white}
            />
            <Text
              style={[
                styles.radioText,
                selectedReason === 'duplicate' && { color: COLOR.white },
              ]}
            >
              Duplicate
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[
              styles.radioBtn,
              selectedReason === 'cancel' && styles.radioBtnActiveBlue,
            ]}
            onPress={() => setSelectedReason('cancel')}
          >
            <RadioButton
              value="cancel"
              status={selectedReason === 'cancel' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedReason('cancel')}
              color={COLOR.white}
              uncheckedColor={COLOR.white}
            />
            <Text
              style={[
                styles.radioText,
                selectedReason === 'cancel' && { color: COLOR.white },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* Dynamic Input Based on Condition */}
        {selectedReason === 'duplicate' ? (
          <>
            <Text style={styles.label}>
              {TEXT.select_duplicate_incident_id()}{' '}
              <Text style={{ color: COLOR.red }}>*</Text>
            </Text>

            <DropDownInput
              label={TEXT.incident_id()}
              name="insId"
              control={control}
              placeholder={TEXT.select_incident_id()}
              items={idList || []}
              rules={{ required: TEXT.incident_id_required() }}
              errors={errors}
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>
              {TEXT.reason_cancellation()}{' '}
              <Text style={{ color: COLOR.red }}>*</Text>
            </Text>

            <TextInput
              mode="outlined"
              placeholder={TEXT.provide_reason_cancellation()}
              value={details}
              onChangeText={setDetails}
              outlineColor="#D9D9D9"
              activeOutlineColor={COLOR.blue}
              multiline
              numberOfLines={3}
              style={styles.textInput}
            />
          </>
        )}

        {/* Save Button */}
      </View>
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSubmit(incidentUpdateStatus)}
      >
        <Text style={styles.saveText}>{TEXT.save()}</Text>
      </TouchableOpacity>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: FONT.R_SBD_600,
    color: COLOR.blue,
    textAlign: 'center',
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioBtn: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.gray,
    borderRadius: 8,
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '48%',
  },
  radioBtnActiveBlue: {
    backgroundColor: COLOR.blue,
  },
  radioText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
  label: {
    fontSize: 16,
    fontFamily: FONT.R_MED_500,
    color: COLOR.blue,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLOR.white,
    marginBottom: 20,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveBtn: {
    margin: WIDTH(4),
    backgroundColor: COLOR.blue,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    alignSelf: 'center',
    width: 160,
  },
  saveText: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
    marginTop: 10,
  },
  titleHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.blue,
    position: 'absolute', // keeps text in center
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
});

export default RejectReasonSheet1;
