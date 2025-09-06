import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ЗаедноНадПламъците',
  server: {
    url: ' http://10.211.151.87:4200/',
    cleartext: true,
  },
  // webDir: 'dist/fireguardapp/browser',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound'],
    },
  },
};

export default config;
