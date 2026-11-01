import { BaseToast, type ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  error: (props) => (
    <BaseToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      style={{
        backgroundColor: '#3f1d1d',
        borderLeftColor: '#f87171',
        borderLeftWidth: 4,
        borderRadius: 12,
        minHeight: 76,
        width: '90%',
      }}
      text1NumberOfLines={2}
      text1Style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}
      text2NumberOfLines={3}
      text2Style={{ color: '#fecaca', fontSize: 13 }}
    />
  ),
};
