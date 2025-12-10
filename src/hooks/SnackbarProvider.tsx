import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar } from 'react-native-paper';
import { Text } from 'react-native';
import { COLOR } from '../themes/Colors';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarContextProps {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined,
);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [bgColor, setBgColor] = useState(COLOR.gray);
  const [textColor, setTextColor] = useState(COLOR.white);

  const showSnackbar = useCallback(
    (msg: string, type: SnackbarType = 'info') => {
      let backgroundColor = COLOR.gray;
      let messageColor = COLOR.white;

      switch (type) {
        case 'success':
          backgroundColor = COLOR.lightGreen;
          messageColor = COLOR.green;
          break;
        case 'error':
          backgroundColor = COLOR.extralightRed;
          messageColor = COLOR.red;
          break;
        case 'warning':
          backgroundColor = COLOR.lightYellow;
          messageColor = COLOR.orange;
          break;
        case 'info':
          backgroundColor = COLOR.lightBlue;
          messageColor = COLOR.blue;
          break;
      }

      setMessage(msg);
      setBgColor(backgroundColor);
      setTextColor(messageColor);
      setVisible(true);
    },
    [],
  );

  const onDismiss = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={3000}
        style={{ backgroundColor: bgColor, zIndex: 9999, elevation: 9999 }}
      >
        <Text style={{ color: textColor }}>{message}</Text>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context.showSnackbar;
};
