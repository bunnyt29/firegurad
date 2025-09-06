import { PushNotifications } from '@capacitor/push-notifications';
import { getCurrentLocation } from './gps.service';
import { environment } from '../../../environments/environment';

export async function setupNotifications() {
  let token = '';

  await PushNotifications.addListener('registration', (notiToken) => {
    token = notiToken.value;
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log(notification);
  });

  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();

  const location = await getCurrentLocation();

  if (!token) return;

  await fetch(`${environment.apiUrl}/notifications/subscribe/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(location),
  });
}
