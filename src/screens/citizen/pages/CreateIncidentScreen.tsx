import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import DropDownInput from '../../../components/inputs/DropDownInput';
import FormTextInput from '../../../components/inputs/FormTextInput';
import FormMediaPicker from '../../../components/inputs/FormMediaPicker';
import { COLOR } from '../../../themes/Colors';
import { FONT, WIDTH } from '../../../themes/AppConst';
import { TEXT } from '../../../i18n/locales/Text';
import { RootState } from '../../../store/RootReducer';
import ApiManager from '../../../apis/ApiManager';
import { useGlobalLoader } from '../../../hooks/GlobalLoaderContext';
import IncidentAddressSheet from '../../../components/bottomSheets/IncidentAddressSheet';
import FormTextInput2 from '../../../components/inputs/FormTextInput2';
import { useNavigation } from '@react-navigation/native';

interface MediaAsset {
  uri?: string;
  type?: string;
  fileName?: string;
}

interface IncidentForm {
  incidentType: string;
  customIncidentType?: string;
  address: string;
  mobileNumber: string;
  description: string;
  media: MediaAsset[];
}

const CreateIncidentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showLoader, hideLoader } = useGlobalLoader();
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  const [incidentTypes, setIncidentTypes] = useState([]);
  const [allAddress, setallAddress] = useState<any>('');
  const [desc, setdesc] = useState([]);
  const [showdropDown, setshowdropDown] = useState(false);

  const addressRef = useRef<any>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    register,
    watch,
  } = useForm<IncidentForm>({
    defaultValues: {
      incidentType: '',
      customIncidentType: '',
      address: '',
      mobileNumber: '',
      description: '',
      media: [],
    },
  });

  const media = watch('media');
  const selectedType = watch('incidentType');

  useEffect(() => {
    register('address', { required: 'Address is required' });
  }, [register]);

  useEffect(() => {
    const getIncidentType = async () => {
      try {
        showLoader();
        const resp = await ApiManager.incidentType(userToken);
        if (resp?.data?.success) {
          setIncidentTypes(
            (resp?.data?.data?.incident_types || []).map((item: any) => ({
              label: item.name,
              value: item.id,
              desc: item.descriptions,
            })),
          );
        }
      } catch (err: any) {
        console.log('Incident Error:', err.response || err);
      } finally {
        hideLoader();
      }
    };

    getIncidentType();
  }, []);

  const handleMediaPick = (items: any[]) => {
    const updated = [...media, ...items];
    setValue('media', updated);
  };

  const handleRemoveMedia = (index: number) => {
    const updated = media.filter((_, i) => i !== index);
    setValue('media', updated);
  };

  const onSubmit = async (data: IncidentForm) => {
    try {
      showLoader();

      const formData = new FormData();
      formData.append('user_id', user?.id || '');
      formData.append('tehsil', user?.tehsil || '');
      formData.append('incident_type_id', String(data?.incidentType));
      formData.append('address', data.address);
      formData.append('mobile_number', data.mobileNumber);
      formData.append('description', data.description);
      formData.append('latitude', allAddress?.latitude || '');
      formData.append('longitude', allAddress?.longitude || '');
      formData.append('state_id', allAddress?.state || '');
      formData.append('city_id', allAddress?.city || '');
      formData.append('district_id', allAddress?.district_id || '');
      formData.append('city_code', allAddress?.pincode || '');
      // formData.append('other_incident_type', data?.customIncidentType || '');

      if (Array.isArray(data.media)) {
        data.media.forEach((file: any, index) => {
          formData.append('upload_media[]', {
            uri: file[0]?.uri,
            type: file.type || 'image/jpeg',
            name: file.fileName || `media_${index}.jpg`,
          });
        });
      }

      const response = await ApiManager.createIncident(formData, userToken);

      if (response?.data?.status) {
        navigation.navigate('incidentDetails', {
          data: response?.data?.incident_id,
        });
        reset();
      } else {
        Alert.alert(
          'Error',
          response?.data?.message || 'Failed to create incident.',
        );
      }
    } catch (error: any) {
      console.log('error', error.response);
      Alert.alert('Error', 'Something went wrong while creating the incident.');
    } finally {
      hideLoader();
    }
  };

  const handleIncidentTypeChange = (value: string) => {
    const selected: any = incidentTypes.find(
      (item: any) => item?.value === value,
    );
    setdesc(selected?.desc || []);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DashBoardHeader drawer={false} setDrawer={() => ''} />
      <ScrollView
        style={styles.innerContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../../assets/backArrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.header}>Create Incident</Text>
        </View>

        {/* Incident Type */}
        <DropDownInput
          label={TEXT.incident_type()}
          name="incidentType"
          control={control}
          placeholder={TEXT.select_incident_type()}
          items={incidentTypes}
          rules={{ required: 'Please specify the incident type' }}
          errors={errors}
          onSelect={value => handleIncidentTypeChange(value)}
        />

        {/* Custom Other Type */}
        {selectedType == '43' && (
          <FormTextInput2
            label="Specify Other Type"
            name="customIncidentType"
            control={control}
            placeholder="Enter other incident type"
            rules={{ required: 'Please specify the incident type' }}
            error={errors.customIncidentType?.message}
          />
        )}

        {/* Address */}
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
            {TEXT.address()} <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <TouchableOpacity
            style={[
              {
                borderWidth: 1,
                borderRadius: 4,
                borderColor: COLOR.gray,
                padding: 14,
              },
              errors.address && { borderColor: 'red' },
            ]}
            onPress={() => addressRef.current.open()}
          >
            {getValues('address') ? (
              <Text
                style={{ fontSize: 16, color: COLOR.black, marginBottom: 40 }}
              >
                {getValues('address')}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: COLOR.lightTextGrey,
                  marginBottom: 40,
                }}
              >
                {TEXT.enter_address()}
              </Text>
            )}
          </TouchableOpacity>

          {errors.address && (
            <Text style={{ color: 'red', fontSize: 12 }}>
              {errors.address.message}
            </Text>
          )}
        </View>

        {/* Mobile Number */}
        <FormTextInput
          label={TEXT.mobile_number()}
          name="mobileNumber"
          control={control}
          placeholder={TEXT.enter_phone_number()}
          keyboardType="phone-pad"
          rules={{
            required: TEXT.phone_number_is_required(),
            pattern: {
              value: /^[0-9]{10}$/,
              message: TEXT.enter_valid_10_digit_number(),
            },
          }}
          error={errors.mobileNumber?.message}
        />

        {/* Description */}
        <View>
          <FormTextInput
            label="Description"
            name="description"
            control={control}
            multiline
            placeholder={TEXT.enter_description()}
            error={errors.description?.message}
            onInputPress={() => {
              setshowdropDown(!showdropDown);
            }}
          />
          {showdropDown && desc.length > 0 && (
            <View style={styles.dropdown}>
              {desc.map((item: any, index: number) => (
                <TouchableOpacity
                  style={styles.dropdowntouch}
                  onPress={() => {
                    setValue('description', item?.description);
                    setshowdropDown(false);
                  }}
                >
                  <Text style={{ fontSize: 14, color: COLOR.textGrey }}>
                    {item?.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Media Picker */}
        <FormMediaPicker
          label="Upload Image"
          name="media"
          control={control}
          // rules={{ required: 'At least one media file is required' }}
          error={errors.media?.message}
          media={media}
          onChangeMedia={handleMediaPick}
          onRemoveMedia={handleRemoveMedia}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.createButtonText}>{TEXT.create()}</Text>
        </TouchableOpacity>
      </ScrollView>

      <IncidentAddressSheet
        ref={addressRef}
        onSubmit={data => {
          setValue('address', data?.flat || '', { shouldValidate: true });
          setallAddress(data);
        }}
      />
    </SafeAreaView>
  );
};

export default CreateIncidentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.blue,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: WIDTH(4),
  },
  header: {
    fontSize: 20,
    fontFamily: FONT.R_SBD_600,
    color: COLOR.blue,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLOR.blue,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: 150,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    marginVertical: 10,
  },

  dropdown: {
    position: 'absolute',
    top: 130,
    left: 0,
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    width: '100%',
    zIndex: 100,
  },
  backButton: {
    position: 'absolute',
    left: -8,
  },
  dropdowntouch: {
    borderBottomWidth: 1,
    borderColor: COLOR.gray,
    padding: 6,
  },

  backIcon: {
    width: 24,
    height: 24,
  },
});
