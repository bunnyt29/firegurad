import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Живот Над Пламъка',
  // server: {
  //   url: 'http://10.219.103.195:4200/',
  //   cleartext: true,
  // },
  webDir: 'dist/fireguardapp/browser',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound'],
    },
  },
};

export default config;
