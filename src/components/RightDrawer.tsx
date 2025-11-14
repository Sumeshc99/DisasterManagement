import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/RootReducer';
import { COLOR } from '../themes/Colors';
import { HEIGHT, WIDTH } from '../themes/AppConst';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../navigation/AppNavigation';
import { clearUser } from '../store/slices/authSlice';
import Edit from '../assets/svg/edit.svg';
import Pass from '../assets/svg/pass.svg';
import Logout from '../assets/svg/logout.svg';
import { clearUserDraft } from '../store/slices/draftSlice';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface RightDrawerProps {
  open: boolean;
  changePass: () => void;
  onClose: () => void;
}

const RightDrawer: React.FC<RightDrawerProps> = ({
  open,
  changePass,
  onClose,
}) => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const dispatch = useDispatch();

  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: open ? 0 : DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const logOut = () => {
    dispatch(clearUser());
    dispatch(clearUserDraft());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'loginScreen' }],
      }),
    );
  };

  return (
    <>
      {open && <Pressable style={styles.overlay} onPress={onClose} />}

      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.full_name
                  ? user.full_name.charAt(0).toUpperCase()
                  : 'UN'}
              </Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>10%</Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {user?.full_name || 'Guest User'}
            </Text>
            <Text style={styles.phone}>{user?.mobile_no}</Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Image
              source={require('../assets/cancel.png')}
              style={{ width: WIDTH(8), height: WIDTH(8) }}
            />
          </TouchableOpacity>
        </View>

        {/* Edit Profile */}
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => {
            navigation.navigate('profile');
            onClose();
          }}
        >
          <Edit />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Profile message */}
        <Text style={styles.infoText}>
          Your profile is incomplete. Please click the 'Edit Profile' button to
          complete it.
        </Text>

        <View style={styles.divider} />

        {/* Change PIN */}
        <TouchableOpacity style={styles.menuItem} onPress={() => changePass()}>
          <Pass />
          <Text style={styles.menuText}>Change PIN</Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Logout */}
        <View style={{ marginBottom: HEIGHT(10) }}>
          <TouchableOpacity onPress={() => logOut()} style={styles.logoutBtn}>
            <Logout />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.versionText}>Version 0.0.0.1</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressCircle: {
    position: 'absolute',
    bottom: -8,
    left: 15,
    backgroundColor: COLOR.blue,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  progressText: {
    color: '#fff',
    fontSize: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  phone: {
    color: '#555',
  },
  closeBtn: {
    width: WIDTH(10),
    height: WIDTH(10),
  },
  closeText: {
    fontSize: 20,
    color: '#333',
    backgroundColor: COLOR.blue,
    padding: 10,
  },
  editProfileBtn: {
    marginTop: 25,
    borderWidth: 1,
    borderColor: COLOR.blue,
    borderRadius: 30,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  editProfileText: {
    color: COLOR.blue,
    fontWeight: '500',
    fontSize: 16,
  },
  infoText: {
    marginTop: 15,
    color: '#555',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
  },
  logoutBtn: {
    backgroundColor: COLOR.blue,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flexDirection: 'row',
    gap: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    fontSize: 12,
  },
});

export default RightDrawer;
