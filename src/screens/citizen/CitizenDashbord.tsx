import React, { useEffect, useRef } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import OpenStreetMap from '../../components/OpenStreetMap';
import { COLOR } from '../../themes/Colors';
import CompleteProfileSheet from '../../components/CompleteProfileSheet';
import ApiManager from '../../apis/ApiManager';

const CitizenDashbord = () => {
  const sheetRef = useRef<RBSheet>(null);

  useEffect(() => {
    sheetRef.current?.open();
  }, []);

  const token =
    'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiaWQiOjIwLCJlbWFpbCI6bnVsbCwicm9sZV9pZCI6OSwicm9sZSI6ImNpdGl6ZW4iLCJtb2JpbGUiOiI5ODQxNTI1MjQwIn0sImlhdCI6MTc2MTIxMjk0OCwiZXhwIjoxNzYxMjE2NTQ4fQ.LjIwyyNJXSvfA4R-6gFiV-vhP5K12dgVu2eI5RzGBXXwZ95QmIgtcoO0LBov9WQq2MnXTkiYbnLuCSKsCFRVUcB7qimH-G4MbLKqxI5KRs-6FqsfWRVyAowldTRJBtsf8Yr0kIGv99WkKZdiXditH1az3_-Ge3w7EVGYmEJK5p-notk8UyiFeR-lUEq6PcxqMFnrrD3Y7kcJhYWRr_RZAqmmbS0GQSnL2HYDYcqr82vV7oZ_U8X_3pwcOLQCvjZG2wVA4virz6-EXM1ZjJ7C4DdFfGuYmrapG3lc3Awtw4qONdgXx16WGk4b8PDeA9YZqoqNzyBk8kurJrGykal3Hdai7XPdCAlYVa4X5vAuJ_k7UGCwQUvD7skbPozYR0Dhg7QLeXvn0syp9AMuehy-CmyELT4vhahhvAlMyE1holXE1es2XSL0uV8PSs1XDYMcEtkGQ8EzUgWYR50flrKzzESc8QkZUBeZstQfiZ-rDHp38kEIf0I-lQiMquyyL-Exh03LKYMa5oOfsmxL7ZSbPWl_zfFXAy2iMJQOdkidKGzQcKQYRihiqdgzaGtsYcdGCyTyQMUTyrY_NStobQsGz7gfk1DyXLYoU9GHDu_hwze30VWFWcBSUlJjQ2vrammn1HZsmq11Ea82OWednnhmkbuWZ3kb_0UaZBy5wbiuxgc';

  useEffect(() => {
    handleResponderList();
  }, []);

  const handleResponderList = () => {
    console.log('aaaaaa');
    ApiManager.responderList()
      .then(resp => {
        console.log('aaaaaa', resp.data);
        if (resp?.data?.status) {
        }
      })
      .catch(err => console.log('error', err));
  };

  const handleShortProfile = (data: any) => {
    const body = {
      mobile: '9841525240',
      full_name: data.fullName,
      full_name_contact: data.emergencyName,
      mobile_no_contact: data.emergencyMobile,
    };

    ApiManager.shortProfile(body, token)
      .then(resp => {
        if (resp?.data?.status) {
        }
      })
      .catch(err => console.log('error', err));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <DashBoardHeader />

      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <OpenStreetMap />
      </View>

      <CompleteProfileSheet
        ref={sheetRef}
        data={''}
        handleSubmit={handleShortProfile}
      />
    </SafeAreaView>
  );
};

export default CitizenDashbord;

const styles = StyleSheet.create({});
