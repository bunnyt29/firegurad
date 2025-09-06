import { PushNotifications } from '@capacitor/push-notifications';
import { environment } from '../../../environments/environment';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { GPSService, SpherePoint } from './gps.service';

export type NotificationData =
  | {
      type: 'fire';
      fireId: string;
    }
  | {
      type: 'certificate';
      certificationSuccessful: boolean;
    };

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public readonly token = new Promise<string>(async (resolve) => {
    try {
      const handle = await PushNotifications.addListener('registration', (t) => {
        resolve(t.value);
        handle.remove();
      });
    } catch {}
  });

  public lastClickedNotification: NotificationData | null = null;

  constructor(private gpsService: GPSService) {
    this.init();
  }

  private async getPermissions() {
    try {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt')
        permStatus = await PushNotifications.requestPermissions();

      return permStatus.receive === 'granted';
    } catch {
      return false;
    }
  }

  private async init() {
    const hasPermissions = await this.getPermissions();
    if (!hasPermissions) return;

    await PushNotifications.addListener('pushNotificationActionPerformed', (event) => {
      this.lastClickedNotification = event.notification.data;
    });

    await PushNotifications.register();

    await this.subscribeToAreaChannel();
  }

  private async subscribeToAreaChannel() {
    await fetch(`${environment.apiUrl}/notifications/subscribe/${await this.token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await this.gpsService.location),
    });
  }
}
