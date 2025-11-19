import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AlertModal from '../../components/AlertModal';
import RejectReasonSheet from '../../components/bottomSheets/RejectReasonSheet';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

const ReviewerSection = () => {
  const navigation = useNavigation<AppStackNavigationProp<'incidentDetails'>>();

  const rejectRef = useRef<any>(null);
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  const [visible, setVisible] = useState(false);
  const [data, setdata] = useState<any>('');

  useEffect(() => {
    const getCurrentIncedent = () => {
      ApiManager.getIncidentDta(user?.id, userToken)
        .then(resp => {
          if (resp?.data?.status) {
            setdata(resp?.data?.data);
            setVisible(true);
          }
        })
        .catch(err => console.log('error', err.response))
        .finally(() => '');
    };

    getCurrentIncedent();
  }, []);

  return (
    data !== '' && (
      <View>
        <AlertModal
          visible={visible}
          onAcknowledge={() => {
            setVisible(false);
            rejectRef.current.open();
          }}
          onViewDetails={() => {
            setVisible(false);
            navigation.navigate('incidentDetails', { data: data?.id });
          }}
          onClose={() => setVisible(false)}
        />

        <RejectReasonSheet ref={rejectRef} />
      </View>
    )
  );
};

export default ReviewerSection;

const styles = StyleSheet.create({});
