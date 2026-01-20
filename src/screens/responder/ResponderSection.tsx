import { StyleSheet, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import AlertModal from '../../components/AlertModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

const POLLING_INTERVAL = 8000;

const ResponderSection = () => {
  const navigation = useNavigation<AppStackNavigationProp<'incidentDetails'>>();
  const { user, userToken }: any = useSelector(
    (state: RootState) => state.auth,
  );

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<any>('');

  useFocusEffect(
    useCallback(() => {
      let intervalId: any;

      const getCurrentIncident = async () => {
        try {
          const resp = await ApiManager.getIncidentDta(user?.id, userToken);

          if (resp?.data?.status) {
            setData(resp?.data?.data || '');
            setVisible(true);
          }
        } catch (err: any) {
          console.log('error', err?.response);
        }
      };

      getCurrentIncident();
      intervalId = setInterval(getCurrentIncident, POLLING_INTERVAL);

      return () => {
        clearInterval(intervalId);
      };
    }, [user?.id, userToken]),
  );

  const onAcknowledge = async () => {
    try {
      const resp = await ApiManager.acceptIncident(
        data?.incident_id,
        user?.id,
        userToken,
      );

      if (resp?.data?.status) {
        setVisible(false);
      }
    } catch (err: any) {
      console.log('acceptIncident error', err?.response);
    }
  };

  const viewDetails = () => {
    setVisible(false);
    navigation.navigate('incidentDetails', { data: data?.incident_id });
  };

  return (
    data !== '' && (
      <View>
        <AlertModal
          visible={visible}
          onAcknowledge={onAcknowledge}
          onViewDetails={viewDetails}
          onClose={() => setVisible(false)}
        />
      </View>
    )
  );
};

export default ResponderSection;

const styles = StyleSheet.create({});
