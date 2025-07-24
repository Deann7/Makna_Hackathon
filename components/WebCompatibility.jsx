import { Platform } from 'react-native';

// Web compatibility utilities
export const isWeb = Platform.OS === 'web';

// Safe area insets for web
export const webSafeAreaInsets = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

// Web-specific styles
export const webStyles = {
  container: {
    maxWidth: isWeb ? 480 : '100%',
    marginHorizontal: isWeb ? 'auto' : 0,
    width: '100%'
  },
  
  scrollView: {
    maxHeight: isWeb ? '100vh' : undefined
  },
  
  modal: {
    maxWidth: isWeb ? 600 : '100%',
    marginHorizontal: isWeb ? 'auto' : 0
  }
};

// Platform-specific alert for web
export const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  if (isWeb) {
    // For web, use browser confirm/alert
    if (buttons.length === 1) {
      alert(`${title}\n\n${message}`);
      if (buttons[0].onPress) buttons[0].onPress();
    } else {
      const confirmed = confirm(`${title}\n\n${message}`);
      if (confirmed && buttons[1]?.onPress) {
        buttons[1].onPress();
      } else if (!confirmed && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // Use React Native Alert for mobile
    const { Alert } = require('react-native');
    Alert.alert(title, message, buttons);
  }
};

// Web-specific component to handle responsive layout
export const WebContainer = ({ children, style = {} }) => {
  return (
    <div style={{
      ...webStyles.container,
      ...style,
      minHeight: isWeb ? '100vh' : undefined
    }}>
      {children}
    </div>
  );
};

// Console logging for web debugging
export const debugLog = (message, data = null) => {
  if (isWeb && __DEV__) {
    console.log(`[MAKNA Web Debug] ${message}`, data);
  }
}; 