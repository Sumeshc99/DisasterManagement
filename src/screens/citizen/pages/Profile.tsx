import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import { COLOR } from '../../../themes/Colors';
import { AppStackNavigationProp } from '../../../navigation/AppNavigation';
import BasicInfo from './BasicInfo';
import EmgContactInfo from './EmgContactInfo';
import ApiManager from '../../../apis/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/RootReducer';
import { useForm, useWatch } from 'react-hook-form';
import ScreenStateHandler from '../../../components/ScreenStateHandler';
import { WIDTH } from '../../../themes/AppConst';
import UpdateConfirmation from '../../../components/bottomSheets/UpdateConfirmation';
import { TEXT } from '../../../i18n/locales/Text';
import { clearUserDraft, setUserDraft } from '../../../store/slices/draftSlice';
import { useGlobalLoader } from '../../../hooks/GlobalLoaderContext';
import { setUser } from '../../../store/slices/authSlice';

const formatDate = (inputDate: string | Date): string => {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const Profile: React.FC = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const dispatch = useDispatch();

  const statusRef = useRef<any>(null);
  const draftRef = useRef<any>(null);
  const { showLoader, hideLoader } = useGlobalLoader();

  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const draft = useSelector((state: RootState) => state?.draft?.user);
  console.log('user', user);

  const [activeTab, setActiveTab] = useState<'basic' | 'emergency'>('basic');
  const [userData, setUserData] = useState<any>({});
  const [loading, setloading] = useState(false);

  const {
    control,
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      email: '',
      district: '',
      city: '',
      tehsil: '',
      block: '',
      pincode: '',
      address: '',
      bloodGroup: '',
      dateOfBirth: '',
      // -----
      document: null,
      primaryName: '',
      primaryRelation: '',
      primaryMobile: '',
      primaryAltMobile: '',
      secondaryName: '',
      secondaryRelation: '',
      secondaryMobile: '',
      secondaryAltMobile: '',
    },
  });

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    setloading(true);
    try {
      const resp = await ApiManager.getUser(user?.id, userToken);
      if (resp.data.status) {
        const data = resp?.data?.data || {};
        setUserData(data);
        // console.log('aaaaa', data);

        reset({
          fullName: draft?.fullName || data?.full_name || '',
          mobileNumber: draft?.mobileNumber || data?.mobile || '',
          email: draft?.email || data?.email || '',
          district: draft?.district || data?.district_name || '',
          city: draft?.city || data?.city || '',
          tehsil: draft?.tehsil || data?.tehsil_name || '',
          block: draft?.block || data?.block_id || '',
          pincode: draft?.pincode || data?.pin_code || '',
          address: draft?.address || data?.address || '',
          bloodGroup: draft?.bloodGroup || data?.blood_group || '',
          dateOfBirth: draft?.dateOfBirth || formatDate(data?.dob) || '',
          document: data.document_url || null,
          primaryName: data?.primary_contact_name || '',
          primaryRelation: data?.relation || '',
          primaryMobile: data?.primary_mobile || '',
          primaryAltMobile: data?.alternate_mobile || '',
          secondaryName: data?.secondary_contact_name || '',
          secondaryRelation: data?.secondary_relation || '',
          secondaryMobile: data?.secondary_mobile || '',
          secondaryAltMobile: data?.secondary_alternate_mobile || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setloading(false);
    }
  };

  const changeTab = () => {
    setActiveTab('emergency');
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    // 🧩 Basic Information
    formData.append('full_name', data.fullName || '');
    formData.append('mobile', data.mobileNumber || '');
    formData.append('email', data.email || '');
    formData.append('state', data.state || '');
    formData.append('district', '1');
    formData.append('city', data.city || '');
    formData.append('tehsil', data.tehsil || '');
    formData.append('block', data.block);
    formData.append('pin_code', data.pincode || '');
    formData.append('address', data.address || '');
    formData.append('blood_grp', data.bloodGroup || '');
    formData.append('dob', data.dateOfBirth || '');

    // 🧩 Emergency Contact
    formData.append('primary_contact_name', data.primaryName || '');
    formData.append('relation', data.primaryRelation || '');
    formData.append('primary_mobile_no', data.primaryMobile || '');
    formData.append('alternate_mobile_no', data.primaryAltMobile || '');
    formData.append('secondary_contact_name', data.secondaryName || '');
    formData.append('secondary_relation', data.secondaryRelation || '');
    formData.append('secondary_mobile_no', data.secondaryMobile || '');
    formData.append(
      'secondary_alternate_mobile_no',
      data.secondaryAltMobile || '',
    );

    if (data.document && typeof data.document === 'object') {
      formData.append('upload_media', {
        uri: data.document.uri,
        type: data.document.type || 'image/jpeg',
        name: data.document.fileName || 'document.jpg',
      } as any);
    }

    formData.append('save_or_draft', '1');
    showLoader();
    try {
      const resp = await ApiManager.updateUser(formData, userToken);
      console.log('Update response:', resp.data);

      if (resp.data.status) {
        console.log('✅ User updated successfully');
        dispatch(
          setUser({
            id: user?.id || '',
            full_name: user?.full_name || '',
            mobile_no: user?.mobile_no || '',
            email: user?.email || '',
            role: user?.role || '',
            tehsil: user?.tehsil || '',
            is_registered: 1,
          }),
        );
        dispatch(clearUserDraft());
        statusRef.current?.open();
        setActiveTab('basic');
      } else {
        console.warn('⚠️ Update failed:', resp.data.message);
      }
    } catch (error) {
      // console.error('❌ Error updating user:', error.response);
    } finally {
      hideLoader();
    }
  };

  const saveInDraft = (formValues: any) => {
    dispatch(setUserDraft(formValues));
    console.log('Draft Saved:', formValues);
    draftRef.current?.open();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.blue} />
      <DashBoardHeader setDrawer={() => ''} />

      {/* Title Bar */}
      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <View style={styles.titleBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image source={require('../../../assets/backArrow.png')} />
          </TouchableOpacity>
          <Text style={styles.title}>{TEXT.profile()}</Text>
          <View style={styles.backButton} />
        </View>

        {/* Tabs */}
        <ScreenStateHandler loading={loading} isEmpty={!userData}>
          <View style={styles.tabContainer}>
            {/* Basic Info */}
            <TouchableOpacity
              style={[styles.tab, activeTab === 'basic' && styles.activeZ]}
              onPress={() => setActiveTab('basic')}
              activeOpacity={0.8}
            >
              <Image
                source={
                  activeTab === 'basic'
                    ? require('../../../assets/a2.png')
                    : require('../../../assets/a1.png')
                }
                style={styles.tabImage}
                resizeMode="contain"
              />
              <View style={styles.textWrapper}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'basic' && styles.activeTabText,
                  ]}
                >
                  Basic Information
                </Text>
              </View>
            </TouchableOpacity>

            {/* Emergency Info */}
            <TouchableOpacity
              style={[
                styles.tab,
                styles.secondTab,
                activeTab === 'emergency' && styles.activeZ,
              ]}
              onPress={() => setActiveTab('emergency')}
              activeOpacity={0.8}
            >
              <Image
                source={
                  activeTab === 'emergency'
                    ? require('../../../assets/b2.png')
                    : require('../../../assets/b1.png')
                }
                style={styles.tabImageLarge}
                resizeMode="contain"
              />
              <View style={styles.textWrapper}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'emergency' && styles.activeTabText,
                  ]}
                >
                  {TEXT.emergency_contact_info()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'basic' ? (
              <BasicInfo
                control={control}
                errors={errors}
                saveInDraft={saveInDraft}
                handleSubmit={handleSubmit}
                onSubmit={changeTab}
              />
            ) : (
              <EmgContactInfo
                control={control}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setValue={setValue}
                watch={watch}
              />
            )}
            <View style={styles.spacer} />
          </ScrollView>
        </ScreenStateHandler>
      </View>

      <UpdateConfirmation
        ref={statusRef}
        message={'Profile saved successfully'}
        onUpdatePress={() => statusRef.current?.close()}
      />

      <UpdateConfirmation
        ref={draftRef}
        message={'Profile saved a draft successfully'}
        onUpdatePress={() => draftRef.current?.close()}
      />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.blue,
  },
  titleBar: {
    backgroundColor: COLOR.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.blue,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white,
    gap: 24,
    paddingBottom: 10,
    paddingHorizontal: WIDTH(4),
  },
  tab: {
    height: 40,
    position: 'relative',
  },
  secondTab: {
    marginLeft: -20,
  },
  textWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#4F4F4F',
    fontWeight: '600',
  },
  activeTabText: {
    color: COLOR.white,
  },
  activeZ: {
    zIndex: 2,
  },
  tabImage: {
    width: WIDTH(36),
    height: 40,
  },
  tabImageLarge: {
    width: WIDTH(54),
    height: 40,
  },
  content: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  spacer: {
    height: 40,
  },
});
