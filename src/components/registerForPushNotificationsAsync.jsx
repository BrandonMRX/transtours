import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

/*
export default async function registerForPushNotificationsAsync() {
  try {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // Stop here if the user did not grant permissions
    if (status !== 'granted') {
      return null;
    }
    // Get the token that identifies this device
    const token = await Notifications.getExpoPushTokenAsync();
    return token; 
  }
  catch(err) {
    //////console.log(err);
  }
}*/


export default async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        //alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //////console.log(token);
    } else {
      //alert('Must use physical device for Push Notifications');
    }
  
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    
  
    return token;
}